const user = require('../database/models/user'),
    mailgun = require('mailgun-js');
    require('dotenv').config();
//MAILGUN CONFIGURATION
    const mail = new mailgun({
    apiKey: process.env.MAILGUN_API,
    domain: process.env.MAIL_DOMAIN
});
//add controllers below
exports.eventConfirmation = async (req, res) => {
    userId = req.user.user._id;
    userEmail = null;
    userName = null;

    user.findById({ _id: userId }, (user) => {
        userEmail = user.contact.email;
        user.userName = user.name
    })
    var data = {
        from: 'Somesh Koli <kolisomesh27@gmail.com>',
        to: userEmail,
        subject: 'Hello',
        text: 'Testing some Mailgun awesomeness!'
    }
    sendEmail(data);
    res.send("hello");
}

//mail function
const sendEmail = (data) => {
    mail.messages().send(data, (error, body) => {
        console.log(error, body)
    })
}