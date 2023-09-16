const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconnection');
const Car = require('./car'); 

const Booking = sequelize.define('Booking', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status:{
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  zipCode: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: Car,
      key: 'id',
    },
  },
  pickupDate: {
    type: DataTypes.DATE,
  },
  dropOffDate: {
    type: DataTypes.DATE,
  },
  location: {
    type: DataTypes.STRING,
  },
  licenseNumber: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'booking',
});

Booking.belongsTo(Car, { foreignKey: 'carId' });

module.exports = Booking;
