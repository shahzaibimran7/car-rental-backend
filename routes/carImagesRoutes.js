// routes/carImageRoutes.js
const express = require('express');
const { uploadCarImage } = require('../controllers/carImageController');

const router = express.Router();
const { upload } = require('../controllers/carController');
// Define a route for uploading a car image
router.post('/uploadImage', upload.single('image'), uploadCarImage);

module.exports = router;
