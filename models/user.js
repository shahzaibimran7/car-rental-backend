    const { DataTypes } = require('sequelize');
    const sequelize = require('../config/dbconnection');

    const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      }
    }, {
      tableName: 'user'
    });
    module.exports = User;
