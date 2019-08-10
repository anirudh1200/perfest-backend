// To make controller
const user = require('../database/models/user');
const volunteer = require('../database/models/volunteer');
const admin = require('../database/models/admin');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    if (req.body.userType == 'user') {
        user.findOne({ 'contact.email': req.body.user.email } || { 'contact.phone': req.body.user.phone })
            .exec()
            .then(user => {
                // console.log(user);
                // res.json(user);
                if (!user) {
                    return res.status(401).json({
                        message: "user not found",
                    })
                }
                // console.log(user);
                // console.log(req);
                if (user.password == req.body.password) {
                    let jwt_token = jwt.sign({

                        type: user.type,
                        userId: user._id,
                    }, "secret", {
                            expiresIn: "1d",
                        })
                    // console.log(process.env.JWT_KEY)
                    return res.status(200).json({
                        message: "successfull",
                        token: jwt_token
                    });
                }
                else {
                    return res.status(401).json({
                        message: "unauth"
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else if (req.body.userType == 'volunteer') {
        vol.findOne({ 'contact.email': req.body.email } || { 'contact.phone': req.body.phone })
            .exec()
            .then(user => {
                // console.log(user);
                // res.json(user);
                if (!user) {
                    return res.status(401).json({
                        message: "user not found",
                    })
                }
                // console.log(user);
                // console.log(req);
                if (user.password == req.body.password) {
                    let jwt_token = jwt.sign({
                        type: "volunteer",
                        userId: user._id,
                    }, "secret", {
                            expiresIn: "1d",
                        })
                    // console.log(process.env.JWT_KEY)
                    return res.status(200).json({
                        message: "successfull",
                        token: jwt_token
                    });
                }
                else {
                    return res.status(401).json({
                        message: "unauth"
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else if (req.body.userType == 'admin') {
        admin.findOne({ 'contact.email': req.body.email } || { 'contact.phone': req.body.phone })
            .exec()
            .then(user => {
                // console.log(user);
                // res.json(user);
                if (!user) {
                    return res.status(401).json({
                        message: "user not found",
                    })
                }
                // console.log(user);
                // console.log(req);
                if (user.password == req.body.password) {
                    let jwt_token = jwt.sign({

                        type: "admin",
                        userId: user._id,
                    }, "secret", {
                            expiresIn: "1d",
                        })
                    // console.log(process.env.JWT_KEY)
                    return res.status(200).json({
                        message: "successfull",
                        token: jwt_token
                    });
                }
                else {
                    return res.status(401).json({
                        message: "unauth"
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else {
        return res.status(400).json({
            message: "hello world"
        });
    }
}

exports.signup = (req, res, next) => {
    let data = {
        name: req.body.name,
        password: req.body.password,
        contact: {
            email: req.body.email,
            phone: req.body.phone
        },
        college: {
            name: req.body.college,
            department: req.body.department,
            year: req.body.year
        },
        type: false,
        csi_member: req.body.member
    };
    let newUser = new User(data);
    try {
        return newUser.save();
    } catch (err) {
        console.log(err);
        return;
    }
}

exports.updateProfile = (req, res) => {
    
}