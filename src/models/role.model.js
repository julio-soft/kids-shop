module.exports = (sequelize, Sequelize) => {

    const options = { timestamps: false };

    const Role = sequelize.define("roles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    }, options );
    
    return Role;
  };