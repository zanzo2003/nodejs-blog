const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//body parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));



router.use((req, res, next) => {
    // changing layout for my admin panel
    req.app.set('layout', '../views/layout/admin');
    next();
});



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

        const username = req.body.username;
        const password = req.body.password;

    } catch (error) {
        res.send(error);
        console.log(error)    
    }

});



//admin registration route 

router.post('/register', async (req, res) => {

    try {

        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {

            const user = await User.create({username, password: hashedPassword});
            res.status(201).json({messagae: 'user created', user});
            
        } catch (error) {

            if(error.code === 11000) {
                res.status(409).json({ message: 'User already in use'});
              }
              res.status(500).json({ message: 'Internal server error'});
            
        }

    } catch (error) {
        res.send(error);
        console.log(error)    
    }

});


module.exports = router;