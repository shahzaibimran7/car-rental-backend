const express = require("express");
const router = express.Router();
// const multer = require('multer');
const fileUpload = require("express-fileupload"); // Import express-fileupload module
router.use(fileUpload()); // Initialize fileUpload middleware

const carController = require("../controllers/carController");
router.post("/createCar", (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const image = req.files.image;
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + "-" + image.name;

  image.mv("./uploads/" + filename, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    carController.createCar(req, res, filename);
  });
});
router.get("/getAllCars", carController.getAllCars);
router.get("/getCarsByBrand/:brand", carController.getCarByBrand);

router.get("/getCarsById/:id", carController.getCarById);

router.post("/UpdateCarById/:id", (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const image = req.files.image;
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + "-" + image.name;

  image.mv("./uploads/" + filename, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    carController.updateCarById(req, res, filename);
  });
});
router.get("/getAllDetails/:carId", carController.getCarWithImages);
router.post("/deleteCarById/:id", carController.deleteCarById);

module.exports = router;
