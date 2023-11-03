// models/CarImage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconnection");

const CarImage = sequelize.define(
  "CarImage",
  {
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "carimages",
  }
);

module.exports = CarImage;
