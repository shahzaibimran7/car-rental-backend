    const Car = require('../models/car');
    const multer = require('multer');
    const fs = require('fs');
    const { promisify } = require('util');
    const path = require('path');
const CarImage = require('../models/carImage');
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

    const createCar = async (req, res) => {
        try {
        const { name, price, brand, transmission, fuel, doors } = req.body;
        console.log(req.file)
        const image = req.file;
    
        if (!image) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const newCar = await Car.create({
            name,
            image: image.filename,
            price,
            brand,
            transmission,
            fuel,
            doors,
        });
    
        res.status(201).json(newCar);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating car' });
        }
    };
    


    const getAllCars = async (req, res) => {
        try {
          const cars = await Car.findAll();
      
          const carsWithImages = await Promise.all(
            cars.map(async (car) => {
              const imageFilePath = path.join('uploads', car.image);
              console.log(imageFilePath)
              const imageBuffer = await fs.promises.readFile(imageFilePath);
      
              const carWithImage = {
                ...car.toJSON(),
                image: imageBuffer.toString('base64'), 
              };
      
              return carWithImage;
            })
          );
      
          res.status(200).json(carsWithImages);
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
      
        
          const imageFilePath = path.join('uploads', car.image);
          const imageBuffer = await fs.promises.readFile(imageFilePath);
      
        
          const carWithImage = {
            ...car.toJSON(),
            image: imageBuffer.toString('base64'), 
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
      
      
          const prevImageFilePath = path.join('uploads', car.image);
      
        
          if (fs.existsSync(prevImageFilePath)) {
            fs.unlinkSync(prevImageFilePath);
          }
      
 
          const newImage = req.file;
          if (newImage) {
            const newImageFilePath = path.join('uploads', newImage.filename);
       
            car.image = newImage.filename; 
          }
      

          await car.save();
      
          res.status(200).json(car);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error updating car' });
        }
      };


      const getCarWithImages = async (req, res) => {
        try {
          const { carId } = req.params;
      
          // Find the car by ID
          const car = await Car.findByPk(carId, {
            include: [CarImage],
          });
      
          if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
          }
      
          // Extract and load the main car image
          const imageFilePath = path.join('uploads', car.image);
          const imageBuffer = await fs.promises.readFile(imageFilePath);
      
          // Extract and load additional car images
          const carImages = await Promise.all(
            car.CarImages.map(async (image) => {
              const imageFilePath = path.join('uploads/', image.filename);
              const imageBuffer = await fs.promises.readFile(imageFilePath);
      
              return {
                filename: image.filename,
                buffer: imageBuffer.toString('base64'),
              };
            })
          );
      
          // Combine the car data with the main image and additional images
          const carWithImages = {
            ...car.toJSON(),
            image: imageBuffer.toString('base64'),
            additionalImages: carImages, // Include additional car images
          };
      
          // Send the car data along with the image buffers in the response
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
  
      const imageFilePath = path.join('uploads', car.image);
  
      if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
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
  upload,
  getCarWithImages
};
