const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtToken = process.env.JWT_SECRET;

//body parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));



router.use((req, res, next) => {
    // changing layout for my admin panel
    req.app.set('layout', '../views/layout/admin');
    next();
});


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - login' });
    }

    try {
        const decoded = jwt.verify(token, jwtToken);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized - new login' });
    }
}

app.use(authMiddleware);


// admin login page
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/index', { locals });

    } catch (error) {
        console.log(error);
    }
});


//admin login check 

router.post('/admin', async (req, res) => {

    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const pswd = await bcrypt.compare(password, user.password);

        if (!pswd) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, jwtToken);
        res.cookie('token', token, [{ httpsOnly: true }]);
        res.redirect('/dashboard');


    } catch (error) {
        res.send(error);
        console.log(error)
    }

});


// dashboard route
router.get('/dashboard', authMiddleware, async (req, res) => {
    const locals = {
        title: "Dashboard",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    try {

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]);

        res.render('admin/dashboard', {
            locals,
            data
        });

    } catch (error) {
        console.log(error)
        res.json({ error: error });
    }
})

//route to logout

router.get('/logout', (req, res) => {

    res.clearCookie('token');
    res.redirect('/admin');

})



//admin registration route 

router.post('/register', async (req, res) => {

    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {

            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ messagae: 'user created', user });

        } catch (error) {

            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use' });
            }
            res.status(500).json({ message: 'Internal server error' });

        }

    } catch (error) {
        res.send(error);
        console.log(error)
    }

});



//add post route 

router.get('/add-post', authMiddleware, async (req, res) => {
    const locals = {
        title: "Add Post",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    res.render('admin/add-post');
})

router.post('/add-post', authMiddleware, async (req, res) => {

    try {

        const { title, body } = req.body;
        const article = await Post.create({ title: title, body: body });
        res.redirect('/dashboard');

    } catch (error) {

        res.status(401).json({ message: error });

    }

})

//delete post route

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {

        const user = req.params.id;
        const title = await Post.findOne({ _id: user });
        if (req.query._method == 'DELETE') {
            var del_record = await Post.deleteOne({ _id: user });
            res.redirect('/dashboard');
        }

    } catch (error) {
        res.status(401).json({ message: error });
    }
})


//edit post route

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    const locals = {
        title: "Dashboard",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    try {

        const article = await Post.findOne({ _id: req.params.id });
        res.render('admin/edit-post', { locals, data: article });

    } catch (error) {

        res.status(401).json({ message: error });

    }
})

router.put('/edit-post/:id', authMiddleware, async(req, res)=>{

    try {

        if(req.query._method == 'PUT'){
            const id = req.params.id;
            const {title, body} = req.body;
            await Post.findByIdAndUpdate(id, {
                title: title,
                body: body,
                updatedAt: Date.now()
            });
        }
        res.redirect('/dashboard');
        
    } catch (error) {

        res.status(401).json({message: error});
        
    }

})





module.exports = router;