const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");

var express = require("express");
var router = express.Router();

router.use("/test", userRoute);
router.use("/auth", authRoute);

module.exports = router;
