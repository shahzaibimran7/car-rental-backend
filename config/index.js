const dotenv = require("dotenv")
dotenv.config();
// define validation for all the env vars
const config = {

    database: process.env.DATABASE,
    username: 'root',
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT, 

};

module.exports = config;
