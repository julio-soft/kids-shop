const config = require("../config/db.config");
const Sequelize = require("sequelize");

// sequelize instance
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  logging: false,
  define: {
    timestamps: false,
  },
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require("./Auth/user.model.js")(sequelize, Sequelize);
db.role = require("./Auth/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.shop = require("./Shop/product.model")(sequelize, Sequelize);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
