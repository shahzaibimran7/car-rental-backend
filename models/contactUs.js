const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconnection');

const ContactUs = sequelize.define('ContactUs', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  query: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
}, {
  tableName: 'contact_us',
});

module.exports = ContactUs;
