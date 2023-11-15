require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");


const port = 3000 || process.env.PORT;
const app = express();
const connectDB = require("./server/config/db");

app.use(express.static("public"));

//connect to Database
connectDB();

//Templating engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layout/main")


app.use("/", require("./server/routes/main"));


app.listen(port, ()=>{
    console.log(`The server is up and running at ${port}`);
});