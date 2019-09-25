const cuid = require("cuid");
const Ticket = require("../database/models/ticket");
const User = require("../database/models/user");
const Volunteer = require("../database/models/volunteer");
const Event = require("../database/models/events");
const Admin = require("../database/models/admin");
const mail = require('../controllers/mailController');
const College = require('../database/models/college');

exports.issue = async (req, res) => {
    //Expecting these params from frontend when issuing a ticket
    let { name, phone, email, event_id, price, paid, participantNo, college, csi_member } = req.body;
    let issuerType = req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1);
    //Check if user with following email or phone already exists
    let oldAdmin;
    let oldVol;
    try {
        oldVol = await Volunteer.findOne({ "contact.email": email });
        oldAdmin = await Admin.findOne({ "contact.email": email });
    } catch (error) {
        return res.json({ success: false })
    }
    if (oldAdmin || oldVol) {
        return res.status(500).json({ success: false, error: "Email is ether registered as admin or volunteer" })
    }
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
            try
            {
                usr = await newUser.save();
            }
            catch(err){
                console.log(err)
            }
            let collegeData = {
                name: college.name
            }
            let newcollege = new College();
            await newcollege.findOneAndUpdate({},
                collegeData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

        }
        let event = await Event.findById(event_id);
        let ticketData = {
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
        }
        let oldData = {
            user_id: usr._id,
            event: event_id,
            price: price,
            paid: paid,
            participantNo: participantNo,
        }
        let oldTicket = await Ticket.findOne(oldData)
        if (oldTicket) {
            return res.status(500).json({ success: false, error: "Ticket for this data set already issued" })
        }
        let newTicket = new Ticket(ticketData);
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
                volunteer.sold.amountCollected = volunteer.sold.amountCollected + paid;
                try {
                    await volunteer.save();
                } catch (err) {
                    console.log(err);
                    return res.json({ success: false, error: err });

                }
            } catch (err) {
                console.log(err);
                return res.json({ success: false, error: err });
            }
        }
        try {
            let result = await mail.eventConfirmation(usr, ticket);
            if (!result) {
                return res.status(500).json({ success: result, error: 'mail issue' });

            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, error: err });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, error: err });
    }
    return res.json({ success: true });
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
        let ticket;
        let volunteer;
        try {
            ticket = await Ticket.findOne({ _id: ticketId });
            if (ticket.volunteer_id.kind === 'Volunteer') {
                volunteer = Volunteer.findOne({ _id: ticket.volunteer_id.value });
                Volunteer.update({ _id: ticket.volunteer_id.value }, { $pullAll: { 'sold.ticket': [ticket._id] }, $set: { 'sold.amountCollected': volunteer.sold.amountCollected - ticket.paid } })
            }
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
        try {
            await User.update({ _id: ticket.user_id }, { $pullAll: { tickets: [ticket._id] } });
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
        try {
            await Ticket.deleteOne({ _id: ticketId });
            res.json({ success: true });
            return;
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
    }
    res.json({ success: false, error: 'ticketId not passed' });
}

//TODO event scan