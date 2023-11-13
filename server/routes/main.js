const express = require("express");

const app = express();
const router = express.Router();
app.set("view engine", "ejs");

router.get("/", (req, res)=>{
    const data = {
        title: "Home",
        descrption: "This is a blog website, where people can create account, write, read and edit their blogs"
    }
    res.render("index.ejs", data);
});

router.get("/about", (req, res)=>{
    const data = {
        title: "About",
        descrption: "This is a blog website, where people can create account, write, read and edit their blogs"
    }
    res.render("about.ejs", data);
});

router.get("/contact", (req, res)=>{
    const data = {
        title: "Contacts",
        descrption: "This is a blog website, where people can create account, write, read and edit their blogs"
    }
    res.render("contact.ejs", data);
});

module.exports = router;