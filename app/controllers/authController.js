// To make controller
const User = require('../database/models/user');
const Volunteer = require('../database/models/volunteer');
const Admin = require('../database/models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mail = require('./mailController')
const saltRounds = 12;

const sendToken = (res, user, type) => {
    let jwt_token = jwt.sign({
        type,
        userId: user._id,
    }, "secret", {
        expiresIn: "1d",
    });
    res.json({ success: true, token: jwt_token });
}

const checkUser = (req, res, user, token, type) => {
    if (user) {
        // To be userd after hashing is enabled
        bcrypt.compare(req.body.password, user.password, function (err, success) {
            if (success) {
                sendToken(res, user, type);
            } else {
                if (user.password === req.body.password) {
                    sendToken(res, user, type);
                } else {
                    res.status(401).json({ success: false, token, error: 'invalid credentials' });
                }
            }
        });
        // if (user.password === req.body.password) {
        //     sendToken(res, user, type);
        // } else {
        //     res.status(401).json({ success: false, token, error: 'invalid credentials' });
        // }
        // return true;
        return true;
    }
}

exports.login = async (req, res) => {
    let token = '';
    let error = false;
    let user = await User.findOne({ 'contact.email': req.body.email })
        .catch(err => {
            console.log(err);
            res.json({ success: false, token, error: err });
            error = true;
        });
    if (error || checkUser(req, res, user, token, 'user')) {
        return;
    }
    user = await Volunteer.findOne({ 'contact.email': req.body.email })
        .catch(err => {
            console.log(err);
            res.json({ success: false, token, error: err });
            error = true;
        });
    if (error || checkUser(req, res, user, token, 'volunteer')) {
        return;
    }
    user = await Admin.findOne({ 'contact.email': req.body.email })
        .catch(err => {
            console.log(err);
            res.json({ success: false, token, error: err });
            error = true;
        });
    if (error || checkUser(req, res, user, token, 'admin')) {
        return;
    }
    res.status(401).json({ success: false, token, error: 'no user found' });
}

exports.signup = async (req, res, next) => {
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
    bcrypt.hash(data.password, saltRounds, async (err, hash) => {
        let newUser = new User(data);
        try {
            await newUser.save();
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: err });
            return;
        }
        res.json({ success: true });
    });
}

exports.createUser = async (req, res) => {
    let data;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
    try {
        let user = await User.findOne({ 'contact.email': email });
        if (user) {
            return res.json({ success: false, error: 'email already registered as user' });
        }
        let volunteer = await Volunteer.findOne({ 'contact.email': email });
        if (volunteer) {
            return res.json({ success: false, error: 'email already registered as volunteer' });
        }
        let admin = await Admin.findOne({ 'contact.email': email });
        if (admin) {
            return res.json({ success: false, error: 'email already registered as admin' });
        }
    } catch (err) {
        console.log(err);
        return res.json({ success: false, error: err });
    }
    // To be userd after hashing is enabled
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (!err) {
            if (req.body.phone) {
                data = {
                    contact: {
                        phone
                    },
                    password: hash
                }
            } else {
                data = {
                    contact: {
                        email
                    },
                    password: hash
                }
            }
            let newUser = new User(data);
            try {
                await newUser.save();
            } catch (err) {
                res.json({ success: false, error: err });
                return;
            }
            res.json({ success: true });
        }
    });
    //     if (req.body.phone) {
    //         data = {
    //             contact: {
    //                 phone
    //             },
    //             password
    //         }
    //     } else {
    //         data = {
    //             contact: {
    //                 email
    //             },
    //             password
    //         }
    //     }
    //     let newUser = new User(data);
    //     try {
    //         await newUser.save();
    //     } catch (err) {
    //         console.log(err);
    //         res.json({ success: false, error: err });
    //         return;
    //     }
    //     res.json({ success: true });
    //     return;
}

exports.sendResetLink = async (req, res) => {
    let email = req.body.email;
    let user, type;
    try {
        user = await User.findOne({ 'contact.email': email });
        type = 'user'
        if (!user) {
            user = await Volunteer.findOne({ 'contact.email': email });
            type = 'volunteer'
        }
        if (!user) {
            user = await Admin.findOne({ 'contact.email': email });
            type = 'admin'
        }
    } catch (err) {
        return res.json({ success: false, error: err });
    }
    if (!user) return res.status(500).json({ error: "User not found" });
    if (await mail.resetPassword(user, type)) {
        return res.status(200).json({ success: true, message: "mail was sent successfully" })
    }
    else {
        return res.status(500).json({ success: false, error: "Email not sent. Please try again" })
    }
}

exports.resetPassword = (req, res) => {
    // To be userd after hashing is enabled
    let type = req.body.userStr.slice(-1);
    let userType = { '1': User, '2': Volunteer, '3': Admin };
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        userType[type].findOneAndUpdate({ 'url': req.body.userStr }, { password: hash })
            .then((user) => {
                if (user == null) {
                    return res.json({ success: false, error: "user not found" });
                } else {
                    return res.status(200).json({ success: true, message: "Password was reset" });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ error: "user not found" });
            })
    });
}