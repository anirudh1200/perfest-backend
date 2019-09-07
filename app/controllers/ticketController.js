const cuid = require("cuid");
const Ticket = require("../database/models/ticket");
const User = require("../database/models/user");
const mail = require('../controllers/mailController')

exports.issue = async (req, res) => {
    //Expecting these params from frontend when issuing a ticket
    let { email, event_id, price, paid, participantNo } = req.body;

    //Check if user with following email or phone already exists
    try {
        let usr = await User.findOne(
            { "contact.email": email } //|| { "contact.phone": phone }
        );
        if (!usr) {
            let data = {
                contact: {
                    email
                }
            }
            let newUser = new User(data);
            usr = await newUser.save()
        }
        let newTicket = new Ticket({
            user_id: usr._id,
            url: cuid.slug(),
            event: event_id,
            volunteer_id: req.user.userId,
            price: price,
            paid: paid,
            participantNo: participantNo
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
            let result;
            try {
                result = await mail.eventConfirmation(usr, ticket);
                if (!result) {
                    res.json({ success: result, error: 'mail issue' });
                    return;
                }
                res.json({ success: result });
                return;
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
    } catch (err) {
        console.log(err);
        res.send({ success: false, error: err });
    }
};

exports.invalidate = async (req, res) => {
    let ticketId = req.body.ticketId;
    if (ticketId) {
        try {
            await Ticket.findByIdAndUpdate(
                ticketId,
                { $set: { valid: false } }
            )
        } catch (err) {
            res.json({ success: false, error: err });
            return;
        }
        res.json({ success: true });
        return;
    }
    res.json({ success: false, error: 'tickedId not passed' });
}

exports.getDetails = async (req, res) => {
    let ticketUrl = req.body.ticketUrl;
    if (ticketUrl) {
        try {
            let ticket = await Ticket.findOne({ url: ticketUrl })
                .populate('user_id')
                .populate('event');
            let userType = ticket.user_id.type;
            let { event } = ticket;
            let eventDetails = {
                name: event.name,
                date: event.date,
                venue: event.venue,
            }
            let ticketDetails = {
                _id: ticket._id,
                price: ticket.price,
                paid: ticket.paid,
                balance: ticket.balance,
                participantNo: ticket.participantNo,
                valid: ticket.valid,
            }
            res.json({ success: true, userType, eventDetails, ticketDetails });
            return;
        } catch (err) {
            res.json({ success: false, error: err });
            return;
        }
    }
    res.json({ success: false, error: 'tickedId not passed' });
}

//TODO event scan