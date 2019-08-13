const express = require('express'),
	router = express.Router(),
	auth = require('../app/controllers/authController');

// Routes are to be added


// @route		POST /user/list
// @desc		will get all users/volunteers
// @params		(phone_no/email)+password
// @return		token containing type and user_id 
// @permission	all
router.post("/login", auth.login);

// @route		POST /user/list
// @desc		will get all users/volunteers
// @params		(phone_no/email)
// @return		status 
// @permission	volunteer & users
router.post("/signup", auth.signup);

module.exports = router;