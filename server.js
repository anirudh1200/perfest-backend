const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
    logger = require('morgan'),
    seedDb = require('./seed.js'),
    authRoutes = require('./routes/authRoutes'),
    userRoutes = require('./routes/userRoutes'),
    eventRoutes = require('./routes/eventRoutes'),
    authMiddleware=require('./app/middleware/middleware');

const app = express();

//=======================
// MIDDLEWARE
//=======================

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//=======================
// DATABASE CONFIG
//=======================

// for development
const mongo_uri = 'mongodb://localhost/perfest';
mongoose.connect(mongo_uri, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log("Database connected"))
    .catch(console.log);
seedDb();

//=======================
// ALLOW-CORS
//=======================
// For development
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

//=======================
// ROUTES
//=======================

app.use('/auth/', authRoutes);
app.use('/user/', userRoutes);
app.use('/event/', eventRoutes);

//=======================
// STARTING THE SERVER
//=======================

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port ' + port);
});