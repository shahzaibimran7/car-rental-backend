// routes/carImageRoutes.js
const express = require('express');
const { uploadCarImage } = require('../controllers/carImageController');
const multer = require('multer');

const router = express.Router();
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
// Define a route for uploading a car image
router.post('/uploadImage', upload.single('image'), uploadCarImage);

module.exports = router;
