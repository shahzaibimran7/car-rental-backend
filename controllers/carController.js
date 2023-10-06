    const Car = require('../models/car');
    const fs = require('fs');
    const { promisify } = require('util');
    const path = require('path');
const CarImage = require('../models/carImage');


    const createCar = async (req, res) => {
        try {
        const { name, price, brand,image, transmission, fuel, doors } = req.body;
        const newCar = await Car.create({
            name,
            image: image,
            price,
            brand,
            transmission,
            fuel,
            doors,
        });
    
        return res.status(200).json(newCar);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error creating car' });
        }
    };
    


    const getAllCars = async (req, res) => {
      try {
        const cars = await Car.findAll();

        const carsWithModifiedImages = cars.map((car) => {
          const imageUrl = car.image;
          const modifiedImageUrl = imageUrl.replace('/view?usp=drive_link', '/preview');
          return {
            ...car.toJSON(),
            image: modifiedImageUrl,
          };
        });
    
        res.status(200).json(carsWithModifiedImages);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving cars' });
      }
    };
    

      const getCarById = async (req, res) => {
        const { id } = req.params;
        try {
          const car = await Car.findByPk(id);
          if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
          }
      
        
          const imageUrl = car.image;
          const modifiedImageUrl = imageUrl.replace('/view?usp=drive_link', '/preview');
      
        
          const carWithImage = {
            ...car.toJSON(),
            image: modifiedImageUrl,
          };
      
          res.status(200).json(carWithImage);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error retrieving car' });
        }
      };
    
      
      const updateCarById = async (req, res) => {
        const { id } = req.params;
        try {
          const car = await Car.findByPk(id);
          if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
          }
          const updatedFields = req.body;
          await car.update(updatedFields);
      
          res.status(200).json(car);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error updating car' });
        }
      };


      const getCarWithImages = async (req, res) => {
        try {
          const { carId } = req.params;
      
        console.log(carId,"=================================================")
          const car = await Car.findByPk(carId, {
            include: [CarImage],
          });
      
          if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
          }

          const mainImageUrl = car.image.replace('/view?usp=drive_link', '/preview');
      
          const additionalImages = car.CarImages.map((image) => {
            const imageUrl = image.filename.replace('/view?usp=drive_link', '/preview');
            return imageUrl;
          });
      
          const carWithImages = {
            ...car.toJSON(),
            image: mainImageUrl,
            additionalImages: additionalImages,
          };
      
          res.status(200).json(carWithImages);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error retrieving car and images' });
        }
      };
      
      


const deleteCarById = async (req, res) => {
    const { id } = req.params;
    try {
      const car = await Car.findByPk(id);
      if (!car) {
        res.status(404).json({ error: 'Car not found' });
        return;
      }
      await car.destroy();
  
      res.status(204).json({ message: 'Succesfully deleted a Car' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting car' });
    }
  };

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
  getCarWithImages
};
