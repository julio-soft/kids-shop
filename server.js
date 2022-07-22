const express = require("express");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config({path: __dirname + '/.env'});

// express app
const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

// middleware
// app.use(logger("dev"));
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// using routes
const routes = require("./src/routes");
app.use("/apiv1", routes);

module.exports = app;
