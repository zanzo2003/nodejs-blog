const nodemailer = require("nodemailer");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'shashwathbhaskarwork@gmail.com',
        pass: '@Home2003'
    },
});


const sendMail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    const { name, email_id, body } = req.body;

    const info = await transporter.sendMail({
        from: `<${email_id}>`, // sender address
        to: 'bhaskarshashwath@gmail.com', // list of receivers
        subject: "Hi!! I am " + name, // Subject line
        text: body, // plain text body
    });

    res.send(info);
}

module.exports = sendMail;