const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.post('/createBooking', bookingController.createBooking);

router.get('/getAllBooking', bookingController.getAllBookings);

router.post('/markBookingDone/:id', bookingController.markBookingDone);

router.get('/bookings/:id', bookingController.getBookingById);

router.delete('/bookings/:id', bookingController.deleteBookingById);

module.exports = router;
