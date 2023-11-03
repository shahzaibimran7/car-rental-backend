const express = require("express");
const { uploadCarImage } = require("../controllers/carImageController");
const fileUpload = require("express-fileupload"); // Import express-fileupload

const router = express.Router();

// Use the fileUpload middleware
router.use(fileUpload());

// Define a route for uploading a car image
router.post("/uploadImage", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }
  // Get the uploaded file
  const image = req.files.image;
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + "-" + image.name;

  // Handle the file as needed (e.g., save it to the server, database, etc.)
  image.mv("uploads/" + filename, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    // Call your controller function to handle the uploaded image
    uploadCarImage(req, res, filename);
  });
});

module.exports = router;
