const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconnection");
const Car = require("./car");

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Categories",
  }
);
module.exports = Category;
