const jwt = require("jsonwebtoken");

exports.authVolunteer = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            } else {
                req.user = tokenData;
                console.log(req.user);
                if (tokenData.type == "volunteer") {
                    next();
                } else {
                    res.status(401).json({
                        message: "un authenticated"
                    });
                }
            }
        });
    } else {
        res.status(401).json({
            message: "un authenticated"
        });
    }
};

exports.authAdmin = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            } else {
                req.user = tokenData;
                console.log(req.user);
                if (tokenData.type == "admin") {
                    next();
                } else {
                    res.status(401).json({
                        message: "un authenticated"
                    });
                }
            }
        });
    } else {
        res.status(401).json({
            message: "un authenticated"
        });
    }
};

exports.authUser = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            } else {
                req.user = tokenData;
                console.log(req.user);
                if (tokenData.type == "user") {
                    next();
                } else {
                    res.status(401).json({
                        message: "un authenticated"
                    });
                }
            }
        });
    } else {
        res.status(401).json({
            message: "un authenticated"
        });
    }
};

exports.authAdminVol = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            } else {
                req.user = tokenData;
                console.log(req.user);
                if (
                    tokenData.type == "volunteer" ||
                    tokenData.type == "admin"
                ) {
                    next();
                } else {
                    res.status(401).json({
                        message: "un authenticated"
                    });
                }
            }
        });
    } else {
        res.status(401).json({
            message: "un authenticated"
        });
    }
};
