const Sequelize = require('sequelize');
const debug = require('debug')('node-server:db');
const config = require('./index');

const dbDetails= config;
console.log(dbDetails)
const sequelize = new Sequelize(dbDetails.database, dbDetails.username, dbDetails.password, {
  host: dbDetails.host,
  dialect: dbDetails.dialect
});
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.log('Unable to connect to the database:', err);
    });

 
module.exports = sequelize;
