const { headers } = require("../middleware");
const controller = require("../controllers/shop/sell.controller");

var express = require("express");
var router = express.Router();

// middleware
router.use(headers.AllowHeader);

// verb
router.post("/", controller.sell);
router.get("/all", controller.seles);

// export
module.exports = router;
