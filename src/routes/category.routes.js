const { authJwt, headers } = require("../middleware");
const controller = require("../controllers/shop/category.controller");

var express = require("express");
var router = express.Router();

// middleware
router.use(headers.AllowHeader);

// verb
router.post("/", [authJwt.isModeratorOrAdmin], controller.create);
router.delete("/all", [authJwt.isModeratorOrAdmin], controller.deleteAll);
router.delete("/:id", [authJwt.isModeratorOrAdmin], controller.delete);
router.put("/", [authJwt.isModeratorOrAdmin], controller.update);
router.patch("/", [authJwt.isModeratorOrAdmin], controller.update);

router.get("/:id", controller.findOne);
router.get("/", controller.findAll);

// export
module.exports = router;
