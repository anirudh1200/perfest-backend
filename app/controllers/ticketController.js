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
            { "contact.email": email } || { "contact.phone": phone }
        );
        if (usr) {
            //If the user already exists, create a new ticket with the event id supplied
            console.log('hello00')
            // console.log(usr)
            let newTicket = new Ticket({
                user_id: usr._id,
                url: cuid.slug(),
                event: event_id,
                volunteer_id:req.user.userId ,
                price:price,
                paid:paid,
                participantNo:participantNo
            });
            // console.log(newTicket)
            // console.log(usr._id)
            newTicket.save(async (err, ticket) => {
                if (err) return res.status(500).json({ 'error': err });
                //Also add this newly created ticket to Users document.
                try {
                    let updatedUser =await User.findOneAndUpdate(
                        {
                            'contact.email': email
                        } ||
                        { 'contact.phone': phone },
                        {
                            $push: { tickets: ticket._id }
                        }
                    )
                    mail.eventConfirmation(usr);
                    res.send({ 'status': 'success' });
                } catch (err) {
                    res.send(err);
                }
            })

        }
    } catch (err) {
        res.send(err);
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
    res.json({ success: false, error: 'tickedId not passed' })
}

//TODO event scan