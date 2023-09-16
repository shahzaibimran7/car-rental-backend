
const multer = require('multer');
const CarImage = require('../models/carImage'); 
const Car = require('../models/car');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/carImages/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadCarImage = async (req, res) => {
  try {
    const { carId } = req.body;
    console.log(carId)
    const car = await Car.findByPk(carId);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const carImage = await CarImage.create({
      carId,
      filename: image.filename,
    });

    res.status(201).json(carImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading car image' });
  }
};

module.exports = {
  uploadCarImage,
};
