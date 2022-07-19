const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const categoryRoute = require("./category.routes");

var express = require("express");
var router = express.Router();

router.use("/test", userRoute);
router.use("/auth", authRoute);
router.use("/category", categoryRoute)

module.exports = router;
