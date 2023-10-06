const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconnection');
const CarImage = require('./carImage');

const Car = sequelize.define('Car', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fuel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doors: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
}, {
  tableName: 'car',
});

Car.hasMany(CarImage, { foreignKey: 'carId', onDelete: 'CASCADE' });

module.exports = Car;
