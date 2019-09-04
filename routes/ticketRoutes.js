const router = require("express").Router();
const middleware = require('../app/middleware/middleware');

const ticket = require("../app/controllers/ticketController");

// @route		POST /ticket/issue
// @desc		ticket will be issued
// @params	    name, email, phone, event_id, price, paid, participantNo 
// @return	    siccess(true/false), error(if any)
router.post("/issue", ticket.issue);
// middleware.authAdminVol,


// @route		POST /ticket/invalidate
// @desc		ticket will no longer be valid
// @params	    ticketId
// @return	    success(true/false), error(if any)
router.post('/invalidate', middleware.authAdminVol, ticket.invalidate);

//TODO event scan

module.exports = router;
