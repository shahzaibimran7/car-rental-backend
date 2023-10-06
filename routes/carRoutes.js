const express = require('express');
const router = express.Router();
const multer = require('multer');
const busboy = require('connect-busboy');
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
router.use(busboy());
const upload = multer({ storage: storage });
router.post('/createCar', (req, res, next) => {
    // Check if the request is a POST request with the 'image' field
    if (req.method === 'POST' && req.busboy) {
        req.busboy.on('file', (fieldname, file, filename) => {
            // Define the destination where you want to save the uploaded file
            const saveTo = `uploads/${Date.now()}-${filename}`;
            const writeStream = fs.createWriteStream(saveTo);

            // Pipe the uploaded file to the write stream
            file.pipe(writeStream);

            // Once the file is saved, invoke the carController.createCar function
            writeStream.on('finish', () => {
                carController.createCar(req, res, saveTo); // Pass the file path to the controller
            });
        });
        req.pipe(req.busboy);
    } else {
        // Handle non-file POST requests here if needed
        carController.createCar(req, res, null); // Pass null as the file path
    }
});
router.get('/getAllCars', carController.getAllCars);


router.get('/getCarsById/:id', carController.getCarById);


router.post('/UpdateCarById/:id', upload.single('image'), carController.updateCarById);

router.get('/getAllDetails/:carId', carController.getCarWithImages);
router.post('/deleteCarById/:id', carController.deleteCarById);

module.exports = router;
