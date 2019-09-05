// To make controller
const User = require('../database/models/user');
const Volunteer = require('../database/models/volunteer');
const Admin = require('../database/models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

const checkUser = (req, res, user, token, error) => {
    if (user) {
        if (user.password === req.body.password) {
            let type = 'user';
            sendToken(res, user, type);
        } else {
            res.status(401).json({ success: false, token, error: 'invalid credentials' });
        }
        return true;
    }
}

exports.login = async (req, res) => {
    let token = '';
    let error = false;
    let user = await User.findOne({ 'contact.email': req.body.email })
        .catch(err => {
            res.json({ success: false, token, error: err });
            error = true;
        });
    if (error || checkUser(req, res, user, token)) {
        return;
    }
    user = await Volunteer.findOne({ 'contact.email': req.body.email })
        .catch(err => {
            res.json({ success: false, token, error: err });
            error = true;
        });
    if (error || checkUser(req, res, user, token)) {
        return;
    }
    user = await Admin.findOne({ 'contact.email': req.body.email })
        .catch(err => {
            res.json({ success: false, token, error: err });
            error = true;
        });
    if (error || checkUser(req, res, user, token)) {
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
            res.json({ success: false, error: err });
            return;
        }
        res.json({ success: true });
    });

}

exports.createanonymous = async (req, res) => {
    let data;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
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
}