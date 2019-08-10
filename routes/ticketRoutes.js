const router = require("express").Router();
const middleware = require('../app/middleware/middleware');

const ticket = require("../app/controllers/ticketController");

router.post("/issue", middleware.authAdminVol,ticket.issue);

module.exports = router;
