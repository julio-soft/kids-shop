const { authJwt, headers } = require("../middleware");
const controller = require("../controllers/shop/valoracion.controller");

var express = require("express");
var router = express.Router();

// middleware
router.use(headers.AllowHeader);

// verb
router.post("/", [authJwt.isModeratorOrAdmin], controller.create);
router.delete("/:id", [authJwt.isModeratorOrAdmin], controller.delete);
router.put("/", [authJwt.isModeratorOrAdmin], controller.update);
router.patch("/", [authJwt.isModeratorOrAdmin], controller.update);

router.get("/:id", controller.findOne);

// export
module.exports = router;
