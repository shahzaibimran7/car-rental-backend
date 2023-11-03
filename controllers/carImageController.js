const multer = require("multer");
const CarImage = require("../models/carImage");
const Car = require("../models/car");
const uploadCarImage = async (req, res, filename) => {
  console.log("INSIDE UPLOAD IMAGE");
  try {
    const { carId } = req.body;
    console.log("IDDDD", carId);
    const car = await Car.findByPk(carId);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }
    const image = filename;

    if (!image) {
      return res.status(400).json({ error: "Image file is required" });
    }
    console.log(image);
    const carImage = await CarImage.create({
      carId,
      filename: image,
    });

    res.status(201).json(carImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading car image" });
  }
};

module.exports = {
  uploadCarImage,
};
