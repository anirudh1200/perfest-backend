const cuid = require("cuid");
const Ticket = require("../database/models/ticket");
const User = require("../database/models/user");
const Volunteer = require("../database/models/volunteer");
const Event = require("../database/models/events");
const mail = require('../controllers/mailController');
const College = require('../database/models/college');

exports.issue = async (req, res) => {
    //Expecting these params from frontend when issuing a ticket
    let { name, phone, email, event_id, price, paid, participantNo, college, csi_member } = req.body;
    let issuerType = req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1);
    //Check if user with following email or phone already exists
    try {
        let usr = await User.findOne(
            { "contact.email": email } //|| { "contact.phone": phone }
        );
        if (!usr) {
            let data = {
                name,
                contact: {
                    email,
                    phone
                },
                college,
                csi_member
            }
            let newUser = new User(data);
            usr = await newUser.save();
            let collegeData = {
                name: college.name
            }
            let newcollege = new College(collegeData);
            await newcollege.save();
        }
        let event = await Event.findById(event_id);
        let newTicket = new Ticket({
            user_id: usr._id,
            url: cuid.slug(),
            secretString: cuid.slug(),
            event: event_id,
            volunteer_id: {
                kind: issuerType,
                value: req.user.userId
            },
            price: price,
            paid: paid,
            participantNo: participantNo,
            date: new Date(),
            validity: event.duration
        });
        let ticket;
        try {
            ticket = await newTicket.save();
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, error: err });
            return;
        }
        try {
            await User.findOneAndUpdate(
                { 'contact.email': email },
                // || { 'contact.phone': phone },
                {
                    $push: { tickets: ticket._id }
                }
            )
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
        if (issuerType === "Volunteer") {

            try {
                volunteer = await Volunteer.findById(req.user.userId);
                volunteer.sold.ticket.push(ticket._id);
                volunteer.sold.amountCollected = volunteer.sold.amountCollected + price;
                try {
                    await volunteer.save();
                    res.json({ success: true });
                } catch (err) {
                    console.log(err);
                    res.json({ success: false, error: err });
                    return;
                }
            } catch (err) {
                console.log(err);
                res.json({ success: false, error: err });
                return;
            }
        }
        try {
            let result = await mail.eventConfirmation(usr, ticket);
            if (!result) {
                res.json({ success: result, error: 'mail issue' });
                return;
            }
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
    } catch (err) {
        console.log(err);
        res.send({ success: false, error: err });
    }
};

exports.invalidate = async (req, res) => {
    let secretString = req.body.secretString;
    let ticketData, ticket, originalTicket;
    if (secretString) {
        try {
            ticket = await Ticket
                .findOne({ secretString })
                .populate('event')
                .populate('user_id')
            originalTicket = JSON.parse(JSON.stringify(ticket));
            let dateDiff = Math.floor((ticket.event.date - new Date()) / 1000 / 60 / 60 / 24);
            // if (dateDiff < ticket.event.duration && dateDiff > -1) {
            if (dateDiff < ticket.event.duration) {
                ticket.validity = ticket.event.duration - dateDiff;
            } else {
                res.json({ success: false, ticketData, error: 'duration error' });
            }
            ticket.save();
        } catch (err) {
            console.log(err);
            res.json({ success: false, ticketData, error: err });
            return;
        }
        res.json({ success: true, ticketData: originalTicket });
        return;
    }
    res.json({ success: false, ticketData, error: 'secretString not passed' });
}

exports.getDetailsFromTicketUrl = async (req, res) => {
    let ticketUrl = req.body.ticketUrl;
    if (ticketUrl) {
        try {
            let ticket = await Ticket.findOne({ url: ticketUrl })
                .populate('user_id')
                .populate('event');
            let userType, userId, eventDetails, ticketDetails;
            try {
                userType = ticket.user_id.type;
                userId = ticket.user_id;
            } catch (err) { }
            try {
                let { event } = ticket;
                eventDetails = {
                    name: event.name,
                    date: event.date,
                    venue: event.venue,
                }
            } catch (err) { }
            try {
                ticketDetails = {
                    _id: ticket._id,
                    price: ticket.price,
                    paid: ticket.paid,
                    balance: ticket.balance,
                    participantNo: ticket.participantNo,
                    valid: ticket.valid,
                    secretString: ticket.secretString,
                    dateIssued: ticket.date
                }
            } catch (err) { }
            res.json({ success: true, userType, eventDetails, ticketDetails, userId });
            return;
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
    }
    res.json({ success: false, error: 'tickedId not passed' });
}

exports.getDetailsFromTicketSecretString = async (req, res) => {
    let secretString = req.body.secretString;
    if (secretString) {
        try {
            let ticket = await Ticket.findOne({ secretString })
                .populate('user_id')
                .populate('event');
            let userType, userId, eventDetails, ticketDetails;
            try {
                userType = ticket.user_id.type;
                userId = ticket.user_id;
            } catch (err) { }
            try {
                let { event } = ticket;
                eventDetails = {
                    name: event.name,
                    date: event.date,
                    venue: event.venue,
                }
            } catch (err) { }
            try {
                ticketDetails = {
                    _id: ticket._id,
                    price: ticket.price,
                    paid: ticket.paid,
                    balance: ticket.balance,
                    participantNo: ticket.participantNo,
                    valid: ticket.valid,
                    secretString: ticket.secretString,
                    dateIssued: ticket.date
                }
            } catch (err) { }
            res.json({ success: true, userType, eventDetails, ticketDetails, userId });
            return;
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
    }
    res.json({ success: false, error: 'secret string not passed' });
}

exports.delete = async (req, res) => {
    let ticketId = req.body.ticketId;
    if (ticketId) {
        try {
            await Ticket.deleteOne({ _id: ticketId });
            res.json({ success: true });
            return;
        } catch (err) {
            res.json({ success: false, error: err });
            return;
        }
    }
    res.json({ success: false, error: 'ticketId not passed' });
}

//TODO event scan