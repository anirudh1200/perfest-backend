const express = require('express'),
	router = express.Router(),
    mail = require('../app/controllers/mailController.js');
    
// @route		POST /mail/eventConfirmation
// @desc		will get all users/volunteers
// @params		token 
// @return		status code   
// @permission	all
router.post("/eventConfirmation", mail.eventConfirmation);


module.exports = router;