const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  let { user } = await User.findByPk(req.userId);
  let { roles } = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }
  res.status(403).json({ message: "Require Admin Role!" });
  return;
};

const isModerator = async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  const roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
  }
  res.status(403).json({
    message: "Require Moderator Role!",
  });
};

const isModeratorOrAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  const roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }
  res.status(403).json({
    message: "Require Moderator or Admin Role!",
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};

module.exports = authJwt;
