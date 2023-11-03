const Car = require("../models/car");
const fs = require("fs");
const zlib = require("zlib");
const { promisify } = require("util");
const path = require("path");
const CarImage = require("../models/carImage");
const sharp = require("sharp");

const createCar = async (req, res, filename) => {
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
    const { page = 1, limit = 5 } = req.query; // Default to page 1 and 10 cars per page

    const offset = (page - 1) * limit;
    const totalCars = await Car.count();

    const cars = await Car.findAll({
      limit: parseInt(limit, 10),
      offset: offset,
    });

    console.log("RETRIEVED Cars", cars);
    const Carpromises = cars.map(async (car) => {
      const imageFilePath = path.join("uploads", car.image);
      const imageBuffer = await fs.promises.readFile(imageFilePath);

      // Compress and resize the image using sharp

      const carWithImage = {
        ...car.toJSON(),
        image: "data:image/jpeg;base64," + imageBuffer.toString("base64"),
      };

      return carWithImage;
    });
    console.log(Carpromises);
    const carsWithImages = await Promise.all(Carpromises);
    // Calculate the next page
    const nextPage = page * limit < totalCars ? parseInt(page) + 1 : null;

    // Prepare the response object
    const response = {
      page: parseInt(page),
      nextPage,
      cars: carsWithImages,
    };
    res.status(200).json(response);
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
    const imageBase64 = imageBuffer.toString("base64");
    const dataURL = `data:image/jpeg;base64,${imageBase64}`;

    const carWithImage = {
      ...car.toJSON(),
      image: dataURL,
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
    const imageBase64 = imageBuffer.toString("base64");
    const dataURL = `data:image/jpeg;base64,${imageBase64}`;
    // Extract and load additional car images
    const carImages = await Promise.all(
      car.CarImages.map(async (image) => {
        const imageFilePath = path.join("uploads/", image.filename);
        const imageBuffer = await fs.promises.readFile(imageFilePath);

        const imageBase64 = imageBuffer.toString("base64");
        const dataURL = `data:image/jpeg;base64,${imageBase64}`;

        return {
          filename: image.filename,
          buffer: dataURL,
        };
      })
    );

    // Combine the car data with the main image and additional images
    const carWithImages = {
      ...car.toJSON(),
      image: dataURL,
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
    console.log("CARRRR", car);
    const imageFilePath = path.join("uploads", car.image);

    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath);
    }

    await car.destroy();

    res.status(204).json({ message: "Succesfully deleted a Car" });
    console.log("SUCCESFULLY DELETED THE CAR");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting car" });
  }
};
const getCarByBrand = async (req, res) => {
  const { brand } = req.params;
  const { page = 1, limit = 5 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const carCount = await Car.count({
      where: {
        brand: brand, // Change the brand as needed
      },
    });

    const cars = await Car.findAll({
      where: {
        brand: brand, // Change the brand as needed
      },
      limit: parseInt(limit, 10), // Correct the base to 10
      offset: offset,
    });

    if (Array.isArray(cars) && cars.length > 0) {
      const carsWithImages = await Promise.all(
        cars.map(async (car) => {
          const imageFilePath = path.join("uploads", car.image);
          const imageBuffer = await fs.promises.readFile(imageFilePath);

          // Compress and resize the image using sharp
          const imageBase64 = imageBuffer.toString("base64");
          const dataURL = `data:image/jpeg;base64,${imageBase64}`;

          const carWithImage = {
            ...car.toJSON(),
            image: dataURL,
          };

          return carWithImage;
        })
      );

      // Calculate the next page
      const nextPage =
        offset + cars.length < carCount ? parseInt(page) + 1 : null;

      // Prepare the response object
      const response = {
        page: parseInt(page),
        nextPage: nextPage,
        cars: carsWithImages,
      };

      res.status(200).json(response);
    } else {
      // Handle the case where no cars were found
      res.status(404).json({ error: "No cars found for the specified brand" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving cars by brand" });
  }
};

const getCarNames = async (req, res) => {
  try {
    const cars = await Car.findAll({
      attributes: ["name"], // Select only the 'name' attribute
    });

    const carNames = cars.map((car) => car.name);

    res.status(200).json(carNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving car names" });
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
  getCarNames,
};
