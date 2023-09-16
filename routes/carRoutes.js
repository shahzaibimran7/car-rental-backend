const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

const { upload } = require('../controllers/carController');
router.post('/createCar', upload.single('image'), carController.createCar);

router.get('/getAllCars', carController.getAllCars);


router.get('/getCarsById/:id', carController.getCarById);


router.post('/UpdateCarById/:id', upload.single('image'), carController.updateCarById);

router.get('/getAllDetails/:carId', carController.getCarWithImages);
router.post('/deleteCarById/:id', carController.deleteCarById);

module.exports = router;
