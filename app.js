require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const port = 3000 || process.env.PORT;  // You can add any port that is free in your local system. Use sudo lsof -nP -i:<PORT NO> to check free port.
const app = express();
const connectDB = require("./server/config/db");

app.use(express.static("public"));



//connect to Database
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//saving the sessions in cookies
app.use(session({
    secret: 'keyboard car',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),
    cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));



//Templating engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layout/main");





// Routing
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));


app.listen(port, ()=>{ 
    console.log(`The server is up and running at ${port}`);
});