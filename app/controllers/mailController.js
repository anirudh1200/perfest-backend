const User = require('../database/models/user'),
    ticket = require('../database/models/ticket')
mailgun = require('mailgun.js');
sendgrid = require('@sendgrid/mail');


require('dotenv').config();
//MAILGUN CONFIGURATION
// const mail=new mailgun()

//SENDGRID CONFIGURATION
const mail = new sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
//add controllers below
exports.eventConfirmation = async (user, Ticket) => {
    let userId = user._id;
    let userEmail = user.contact.email;
    let userName = user.name;
    let genString = Math.random().toString(36).substring(5);
    let generated_link = process.env.HOST + "/t/" + genString;
    var data = {
        from: 'Somesh Koli <kolisomesh27@gmail.com>',
        to:  'Somesh Koli <kolisomesh27@gmail.com>',
        // to: userEmail,
        subject: 'Hello',
        text: generated_link
    }
    //to be updated in databse
    await ticket.findByIdAndUpdate(Ticket._id, { url: genString }, (err) => { console.log });
    // console.log(generated_link)
    //MAILING VIA MAILGUN
    // await mail.messages().send(data, (error, body) => {
    //     console.log(error, body)
    // })
    //MAILING VIA SENDGR
    try {
        await mail.send(data);
    }
    catch(err){
        console.log(err);
        return false;
    }

    return true;
}

//mail function
const sendEmail = (data) => {

}