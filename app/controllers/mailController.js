const User = require('../database/models/user'),
    ticket = require('../database/models/ticket'),
    jwt=require('jsonwebtoken'),
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

exports.resetPassword = async (user) => {
    // let userEmail = "kolisomesh27@gmail.com";
    let userEmail = user.contact.email;
    let userName = user.name;
    // let userName = "Somesh koli";
    let jwt_token = await jwt.sign(
        {
            emailId :userEmail,
            name: userName
        },
        "resetpasswordpassword",
        {
            expiresIn: "30m",
        }
    );

    let generated_link = process.env.HOST + "/c/" + jwt_token;
    var data = {
        from: 'Perfest CC <services@perfest.co>',
        to: userEmail,
        subject: 'Reset your perfest account credentials.',
        text: "Dear " + userName + ",\n Use this email to reset your password.The link will be active for 30 mintue from the issue time.\n"
            + generated_link
    }
    //MAILING VIA MAILGUN
    // await mail.messages().send(data, (error, body) => {
    //     console.log(error, body)
    // })
    //MAILING VIA SENDGR
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