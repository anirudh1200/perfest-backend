const User = require('../database/models/user'),
    ticket = require('../database/models/ticket')
mailgun = require('mailgun-js');
require('dotenv').config();
//MAILGUN CONFIGURATION
const mail = new mailgun({
    apiKey: process.env.MAILGUN_API,
    domain: process.env.MAIL_DOMAIN
});
//add controllers below
exports.eventConfirmation = async (user, Ticket) => {

    let userId = user._id;
    let userEmail = user.contact.email;
    let userName = user.name;
    let genString = Math.random().toString(36).substring(5);
    let generated_link = process.env.HOST + "/t/" + genString;
    var data = {
        from: 'Somesh Koli <kolisomesh27@gmail.com>',
        // to:  'Somesh Koli <kolisomesh27@gmail.com>',
        to: userEmail,
        subject: 'Hello',
        text: generated_link
    }
    //to be updated in databse
    await ticket.findByIdAndUpdate(Ticket._id, { url: genString }, (err) => { console.log });
    // console.log(generated_link)
    await mail.messages().send(data, (error, body) => {
        console.log(error, body)
    })

    return "success"
}

//mail function
const sendEmail = (data) => {

}