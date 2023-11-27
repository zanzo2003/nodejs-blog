const express = require("express");

const app = express();
const router = express.Router();
const Post = require("../models/post");

app.set("view engine", "ejs");
const desc = "This is a blog website, where people can create account, write, read and edit their blogs";



// route for the home page

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Shashwath's Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();


        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});




// route for the article

router.get('/post/:id', async (req, res)=>{
    
    try {
    

        const id = req.params.id;
        const article = await Post.findById({_id: id});
        const locals = {
            title: article.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('post.ejs', {locals, article});
        
    } catch (error) {

        res.status(400).json({message: `error - ${error}`});
        
    }
})



//route for the search

router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Seach",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });















router.get("/about", (req, res) => {
    const data = {
        title: "About",
        descrption: desc
    }
    res.render("about.ejs", data);
});



router.get("/contact", (req, res) => {
    const data = {
        title: "Contacts",
        descrption: desc
    }
    res.render("contact.ejs", data);
});





module.exports = router;