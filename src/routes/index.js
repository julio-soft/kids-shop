const { authJwt } = require("../middleware");

const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const categoryRoute = require("./category.routes");
const tagsRoute = require('./tags.routes')
const ProductRoute = require('./product.routes')
const SellRoute = require('./sell.routes')
const ValRoute = require('./valoracion.routes')
 
var express = require("express");
var router = express.Router();


router.use("/auth", authRoute);
router.use("/test", userRoute);

router.use(authJwt.verifyToken) // verify that the user is authenticated
router.use("/category", categoryRoute)
router.use("/tag", tagsRoute)
router.use("/product", ProductRoute)
router.use("/sell", SellRoute)
router.use("/valoracion", ValRoute)

module.exports = router;
