// To make controller
const User = require('../database/models/user');
const Volunteer = require('../database/models/volunteer');
const Admin = require('../database/models/admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    let user = null;
    let type = null;
    let token = '';
    try {
        if (req.body.phone) {
            user = await User.findOne({ 'contact.phone': req.body.phone });
        } else {
            user = await User.findOne({ 'contact.email': req.body.email });
        }
        if (user) {
            if (user.password === req.body.password) {
                type = 'user';
            } else {
                res.status(401).json({ success: false, token, error: 'invalid credentials' });
                return;
            }
        } else {
            try {
                if (req.body.phone) {
                    user = await Volunteer.findOne({ 'contact.phone': req.body.phone });
                } else {
                    user = await Volunteer.findOne({ 'contact.email': req.body.email });
                }
                if (user) {
                    if (user.password === req.body.password) {
                        type = 'volunteer';
                    } else {
                        res.status(401).json({ success: false, token, error: 'invalid credentials' });
                        return;
                    }
                } else {
                    try {
                        if (req.body.phone) {
                            user = await Admin.findOne({ 'contact.phone': req.body.phone });
                        } else {
                            user = await Admin.findOne({ 'contact.email': req.body.email });
                        }
                        if (user) {
                            if (user.password === req.body.password) {
                                type = 'admin';
                            } else {
                                res.status(401).json({ success: false, token, error: 'invalid credentials' });
                                return;
                            }
                        } else {
                            res.status(401).json({ success: false, token, error: 'no user found' });
                            return;
                        }
                    } catch (err) {
                        res.json({ success: false, token, error: toString(err) });
                        return;
                    }
                }
            } catch (err) {
                res.json({ success: false, token, error: toString(err) });
                return;
            }
        }
    } catch (err) {
        res.json({ success: false, token, error: toString(err) });
        return;
    }
    let jwt_token = jwt.sign({
        type,
        userId: user._id,
    }, "secret", {
            expiresIn: "1d",
        });
    res.json({ success: true, token: jwt_token });
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
    let newUser = new User(data);
    try {
        await newUser.save();
    } catch (err) {
        res.json({ success: false, error: toString(err) });
        return;
    }
    res.json({ success: true });
}

exports.createanonymous = async (req, res) => {
    let data;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
    if (req.body.phone) {
        data = {
            contact: {
                phone
            },
            password
        }
    } else {
        data = {
            contact: {
                email
            },
            password
        }
    }
    let newUser = new User(data);
    try {
        await newUser.save();
    } catch (err) {
        res.json({ success: false, error: toString(err) });
        return;
    }
    res.json({ success: true });
}