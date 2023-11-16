const express = require("express");

const app = express();
const router = express.Router();
const post = require("../models/post");

app.set("view engine", "ejs");
const desc = "This is a blog website, where people can create account, write, read and edit their blogs";

router.get("/", async(req, res) => {

   try {
    const articleData = await post.find();
    res.render("index.ejs", {
        title: "Home",
        descrption: desc,
        article: articleData
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