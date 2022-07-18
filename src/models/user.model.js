module.exports = (sequelize, Sequelize) => {

    const options = { timestamps: false };

    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    }, options);
    
    return User;
  };