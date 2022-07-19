const { authJwt, headers } = require("../middleware");
const controller = require("../controllers/shop/product.constroller");

var express = require("express");
var router = express.Router();

// middleware
router.use(headers.AllowHeader);

// verb
router.post("/", [authJwt.isModeratorOrAdmin], controller.create);
router.delete("/", [authJwt.isModeratorOrAdmin], controller.delete);
router.put("/", [authJwt.isModeratorOrAdmin], controller.update);
router.patch("/", [authJwt.isModeratorOrAdmin], controller.update);
router.patch("/stock", [authJwt.isModeratorOrAdmin], controller.update_stock);

router.get("/:id", controller.findOne);
router.get("/", controller.findAll);

// export
module.exports = router;
