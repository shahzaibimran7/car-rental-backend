const Booking = require('../models/booking');
const Car  = require('../models/car')

const createBooking = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      phoneNumber,
      email,
      address,
      zipCode,
      status,
      city,
      carId,
      pickupDate,
      dropOffDate,
      location,
      licenseNumber,
    } = req.body;


    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(500).json({ error: 'Car does not exist' });
    }


    const newBooking = await Booking.create({
      firstName,
      lastName,
      age,
      phoneNumber,
      email,
      address,
      zipCode,
      status,
      city,
      carId,
      pickupDate,
      dropOffDate, 
      location, 
      licenseNumber, 
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving bookings' });
  }
};


const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      res.status(200).json(booking);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving booking' });
  }
};


const deleteBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      await booking.destroy();
      res.status(204).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting booking' });
  }
};
const markBookingDone = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      await booking.update({ status: 'DONE' });
      res.status(204).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating booking status' });
  }
};


module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBookingById,
  markBookingDone
};
