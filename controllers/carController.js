const Car = require("../models/car");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const CarImage = require("../models/carImage");

const createCar = async (req, res, filename) => {
  console.log("Hello");
  try {
    const { name, price, brand, transmission, fuel, doors } = req.body;

    const newCar = await Car.create({
      name,
      image: filename,
      price,
      brand,
      transmission,
      fuel,
      doors,
    });

    return res.status(200).json(newCar);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating car" });
  }
};

const getAllCars = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 cars per page

    const offset = (page - 1) * limit;

    const cars = await Car.findAll({
      limit: parseInt(limit, 10),
      offset: offset,
    });
    console.log("RETRIEVED Cars", cars);
    const carsWithImages = await Promise.all(
      cars.map(async (car) => {
        const imageFilePath = path.join("uploads", car.image);
        const imageBuffer = await fs.promises.readFile(imageFilePath);

        const carWithImage = {
          ...car.toJSON(),
          image: imageBuffer.toString("base64"),
        };

        return carWithImage;
      })
    );

    res.status(200).json(carsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving cars" });
  }
};

const getCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findByPk(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    const imageFilePath = path.join("uploads", car.image);
    const imageBuffer = await fs.promises.readFile(imageFilePath);

    const carWithImage = {
      ...car.toJSON(),
      image: imageBuffer.toString("base64"),
    };

    res.status(200).json(carWithImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving car" });
  }
};

const updateCarById = async (req, res, filename) => {
  const { id } = req.params;
  try {
    const car = await Car.findByPk(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    const prevImageFilePath = path.join("uploads", car.image);
    if (fs.existsSync(prevImageFilePath)) {
      fs.unlinkSync(prevImageFilePath);
    }
    if (filename) {
      const newImageFilePath = path.join("uploads", filename);
      car.image = filename;
    }

    await car.save();

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating car" });
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
      res.status(404).json({ error: "Car not found" });
      return;
    }

    // Extract and load the main car image
    const imageFilePath = path.join("uploads", car.image);
    const imageBuffer = await fs.promises.readFile(imageFilePath);

    // Extract and load additional car images
    const carImages = await Promise.all(
      car.CarImages.map(async (image) => {
        const imageFilePath = path.join("uploads/", image.filename);
        const imageBuffer = await fs.promises.readFile(imageFilePath);

        return {
          filename: image.filename,
          buffer: imageBuffer.toString("base64"),
        };
      })
    );

    // Combine the car data with the main image and additional images
    const carWithImages = {
      ...car.toJSON(),
      image: imageBuffer.toString("base64"),
      additionalImages: carImages, // Include additional car images
    };

    // Send the car data along with the image buffers in the response
    res.status(200).json(carWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving car and images" });
  }
};

const deleteCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findByPk(id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    const imageFilePath = path.join("uploads", car.image);

    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath);
    }

    await car.destroy();

    res.status(204).json({ message: "Succesfully deleted a Car" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting car" });
  }
};
const getCarByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    console.log("BEFORE QUERY", brand);
    const cars = await Car.findAll({
      where: { brand },
    });
    console.log("AFTER QUERY", cars);
    const carsWithImages = await Promise.all(
      cars.map(async (car) => {
        const imageFilePath = path.join("uploads", car.image);
        const imageBuffer = await fs.promises.readFile(imageFilePath);

        const carWithImage = {
          ...car.toJSON(),
          image: imageBuffer.toString("base64"),
        };

        return carWithImage;
      })
    );

    res.status(200).json(carsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving cars by brand" });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
  getCarWithImages,
  getCarByBrand,
};
