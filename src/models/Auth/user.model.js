module.exports = (sequelize, Sequelize) => {

    const options = { timestamps: false };

    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    }, options);
    
    return User;
  };