const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { secret } = require("../config/jwt");
const Joi = require("joi");

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().allow(null, ""),
  firstName: Joi.string(),
  lastName: Joi.string(),
});
async function signup(req, res) {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "USER",
    });
    delete user.dataValues.password;
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log("User");

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("Password");

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("Token");
    console.log("Secret", secret);
    // Generate JWT token
    const token = jwt.sign({ userId: user.dataValues.id }, secret, {
      expiresIn: "24h",
    });
    console.log("Done");

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      email: user.email,
      username: user.name,
      UserId: user.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new hashed password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  signup,
  login,
  resetPassword,
};
