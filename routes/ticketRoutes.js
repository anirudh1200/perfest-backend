const router = require("express").Router();
const middleware = require('../app/middleware/middleware');

const ticket = require("../app/controllers/ticketController");

router.post("/issue", middleware.authAdminVol,ticket.issue);

// @route		POST /ticket/invalidate
// @desc		ticket will no longer be valid
// @params	ticketId
// @return	siccess(true/false), error(if any)
router.post('/invalidate', middleware.authAdminVol, ticket.invalidate);

module.exports = router;
