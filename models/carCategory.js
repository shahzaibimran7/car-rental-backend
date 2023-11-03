const Car = require("./car");
const Category = require("./category");


Category.belongsToMany(Car, {
  through: "CarCategory",
  onDelete: "CASCADE",
});
