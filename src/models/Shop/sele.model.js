const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  // MODEL Seles
  const sele = sequelize.define("seles", {
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
  });

  return sele;
};
