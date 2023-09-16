const express = require('express');
const router = express.Router();
const contactUsController = require('../controllers/contactUsController');


router.post('/createContactUs', contactUsController.createContactUs);


router.get('/getAllContactUs', contactUsController.getAllContactUs);


router.get('/contact-us/:id', contactUsController.getContactUsById);


router.delete('/contact-us/:id', contactUsController.deleteContactUsById);

module.exports = router;
