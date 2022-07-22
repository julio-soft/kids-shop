const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  // MODEL Seles
  const sele = sequelize.define(
    "seles",
    {
      sale_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return sele;
};
