const { authJwt, headers } = require("../middleware");
const controller = require("../controllers/shop/category.controller");

var express = require("express");
var router = express.Router();

// middleware
router.use(headers.AllowHeader);

// verb
router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.create);
router.delete(
  "/",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.delete
);
router.put("/", [authJwt.verifyToken, authJwt.isModerator], controller.update);
router.patch(
  "/",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.update
);

router.get("/:id", controller.findOne);
router.get("/", controller.findAll);

// export
module.exports = router;
