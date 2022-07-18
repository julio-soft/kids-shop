const express = require('express');
const cors = require("cors");
const logger = require('morgan');

// express app
const app = express();

// routes
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');


var corsOptions = {
    origin: "http://localhost:8081"
};


// middleware
app.use(logger('dev'));
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// using routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
