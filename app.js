import "dotenv/config";
import express from "express";


const port = 3000 || process.env.PORT;
const app = express();


app.get("/", (req, res)=>{
    res.send("Home page");
});


app.listen(port, ()=>{
    console.log(`The server is up and running at ${port}`);
});