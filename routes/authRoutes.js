const express = require('express'),
	router = express.Router(),
	auth=require('../app/controllers/authController');

// Routes are to be added

router.post("/login",auth.login);

module.exports = router;