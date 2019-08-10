const jwt = require('jsonwebtoken');


exports.authVolunteer = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            }
            else {
                req.user = tokenData;
                console.log(req.user);
                if(tokenData.userType=='volunteer'){
                    next()
                }
                res.status(401).json({
                    message: "un authenticated"
                })
            }
        });
    }
    res.status(401).json({
        message: "un authenticated"
    })
}

exports.authAdmin = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            }
            else {
                req.user = tokenData;
                console.log(req.user);
                if(tokenData.userType=='admin'){
                    next()
                }
                res.status(401).json({
                    message: "un authenticated"
                })
            }
        });
    }
    res.status(401).json({
        message: "un authenticated"
    })
}

exports.authUser = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            }
            else {
                req.user = tokenData;
                console.log(req.user);
                if(tokenData.userType=='user'){
                    next()
                }
                res.status(401).json({
                    message: "un authenticated"
                })
            }
        });
    }
    res.status(401).json({
        message: "un authenticated"
    })
}

exports.authAdminVol = (req, res, next) => {
    if (req.body.token) {
        jwt.verify(req.body.token, "secret", (err, tokenData) => {
            if (err) {
                res.status(400);
            }
            else {
                req.user = tokenData;
                console.log(req.user);
                if(tokenData.userType=='volunteer' || tokenData.userType=='admin'){
                    next()
                }
                res.status(401).json({
                    message: "un authenticated"
                })
            }
        });
    }
    res.status(401).json({
        message: "un authenticated"
    })
}