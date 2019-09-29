const User = require('../database/models/user'),
    Ticket = require('../database/models/ticket'),
    sendgrid = require('@sendgrid/mail');


require('dotenv').config();

//SENDGRID CONFIGURATION
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.eventConfirmation = async (user, ticket) => {
    let userEmail = user.contact.email;
    let userName = user.name;
    let genString = Math.random().toString(36).substring(5);
    let generated_link = 'https://' + process.env.HOST + "/t/" + genString;
    let balanceBoolean = false;

    ticket = await Ticket.findById(ticket._id)
        .populate('event')
        .populate('volunteer_id.value')

    if (ticket.balance > 0 || ticket.balance !== null) {
        balanceBoolean = true;
    }

    const mailData = {
        to: userEmail,
        from: 'Perfest <tickets@perfest.co>',
        templateId: 'd-a0a73b06fd99493889935a30fe0ece28',
        dynamic_template_data: {
            "firstName": userName,
            "event": ticket.event.name,
            "fest": "Techmate 2019",
            "venue": "RAIT",
            "date": "10th October",
            "balanceBoolean": balanceBoolean,
            "balance": ticket.balance,
            "ticketLink": generated_link
        }
    }

    // Update in database
    await Ticket.findByIdAndUpdate(ticket._id, { url: genString }, (err) => { console.log });
    try {
        await sendgrid.send(mailData);
    }
    catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

exports.resetPassword = async (user) => {
    let userEmail = user.contact.email;
    let userName = user.name;
    let genString = Math.random().toString(36).substring(3);
    let generated_link = process.env.HOST + "/c/" + genString;
    var data = {
        from: 'Perfest CC <services@perfest.co>',
        to: userEmail,
        subject: 'Reset your perfest account credentials.',
        text: "Dear " + userName + ",\n Use this email to reset your password.The link will be active for 30 mintue from the issue time.\n"
            + generated_link
    }
    // Update the reset url in database
    await User.findByIdAndUpdate(user._id, { url: genString }, (err) => { console.log });

    // Send mail via sendgrid
    try {
        await sendgrid.send(data);
    }
    catch (err) {
        console.log(err);
        return false;
    }

    return true;
}

