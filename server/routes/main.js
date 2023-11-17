const express = require("express");

const app = express();
const router = express.Router();
const post = require("../models/post");

app.set("view engine", "ejs");
const desc = "This is a blog website, where people can create account, write, read and edit their blogs";

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await post.countDocuments({});
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