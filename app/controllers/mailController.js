const User = require('../database/models/user'),
    ticket = require('../database/models/ticket')
sendgrid = require('@sendgrid/mail');


require('dotenv').config();

//SENDGRID CONFIGURATION
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

//add controllers below
exports.eventConfirmation = async (user, Ticket) => {
    let userId = user._id;
    let userEmail = user.contact.email;
    let userName = user.name;
    let genString = Math.random().toString(36).substring(5);
    let generated_link = process.env.HOST + "/t/" + genString;
    var data = {
        from: 'Perfest <tickets@perfest.co>',
        to: userEmail,
        subject: 'Your Tickets',
        text: generated_link
    }
    //to be updated in databse
    await ticket.findByIdAndUpdate(Ticket._id, { url: genString }, (err) => { console.log });
    // console.log(generated_link)

    try {
        await sendgrid.send(data);
    }
    catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

//mail function
const sendEmail = (data) => {

}