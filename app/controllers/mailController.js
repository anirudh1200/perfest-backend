const User = require('../database/models/user'),
    mailgun = require('mailgun-js');
require('dotenv').config();
//MAILGUN CONFIGURATION
const mail = new mailgun({
    apiKey: process.env.MAILGUN_API,
    domain: process.env.MAIL_DOMAIN
});
//add controllers below
exports.eventConfirmation = async (user) => {
    
    let userId = user._id;
    let userEmail = user.contact.email;
    let userName = user.name;

    let generated_link="www.perfest.co/u/"+Math.random().toString(36).substring(5);
    var data = {
        from: 'Somesh Koli <kolisomesh27@gmail.com>',
        to:  userEmail,
        // to: userEmail,
        subject: 'Hello',
        text: generated_link
    }
    console.log(generated_link)
    await mail.messages().send(data, (error, body) => {
        console.log(error, body)
    })

    return "success"
}

//mail function
const sendEmail = (data) => {

}