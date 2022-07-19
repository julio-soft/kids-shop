const db = require("./index");

var bcrypt = require("bcryptjs");

const Role = db.role;
const user = db.user;

/*
 * Se realizar una carga inical a la BD.
 */

module.exports = async function initial() {
  await user_initial();
};

async function user_initial() {
  // **** ROLE ****
  let role_user = await Role.create({
    id: 1,
    name: "user",
  });

  let role_mod = await Role.create({
    id: 2,
    name: "moderator",
  });

  let role_admin = await Role.create({
    id: 3,
    name: "admin",
  });

  // *************

  // **** User *****

  let user_admin = await user.create({
    username: "admin",
    email: "admin@shop.com",
    password: bcrypt.hashSync("admin", 8),
  });

  await user_admin.addRole(role_admin);

  let user_mod = await user.create({
    username: "moderator",
    email: "moderator@shop.com",
    password: bcrypt.hashSync("moderator", 8),
  });

  await user_mod.addRole(role_mod);

  let user_user = await user.create({
    username: "user",
    email: "user@user.com",
    password: bcrypt.hashSync("user", 8),
  });

  await user_user.addRole(role_user);
}

async function initial() {}
