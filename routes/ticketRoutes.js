const router = require("express").Router();
const middleware = require('../app/middleware/middleware');

const ticket = require("../app/controllers/ticketController");

// @route		POST /ticket/issue
// @desc		ticket will be issued
// @params	name, email, phone, event_id, price, paid, participantNo 
// @return	success(true/false), error(if any)
router.post("/issue", middleware.authAdminVol, ticket.issue);


// @route		POST /ticket/invalidate
// @desc		ticket will no longer be valid
// @params	ticketId
// @return	success(true/false), error(if any)
router.post('/invalidate', middleware.authAdminVol, ticket.invalidate);

// @route		POST /ticket/getDetailsFromTicketUrl
// @desc		get particular ticket detail
// @params	ticketUrl
// @return	success(true/false), error(if any), userType(bool), eventDetails, ticketDetails
router.post('/getDetailsFromTicketUrl', ticket.getDetailsFromTicketUrl);

//TODO event scan

module.exports = router;
