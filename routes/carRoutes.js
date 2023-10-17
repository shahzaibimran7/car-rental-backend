const express = require('express');
const router = express.Router();
const multer = require('multer');

const carController = require('../controllers/carController');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log("==========================",file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/createCar', upload.single('image'), carController.createCar);

router.get('/getAllCars', carController.getAllCars);


router.get('/getCarsById/:id', carController.getCarById);


router.post('/UpdateCarById/:id', upload.single('image'), carController.updateCarById);

router.get('/getAllDetails/:carId', carController.getCarWithImages);
router.post('/deleteCarById/:id', carController.deleteCarById);

module.exports = router;
