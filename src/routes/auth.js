const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { userSchema, loginSchema } = require("../utils/validatations");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    const { error } = userSchema.validate(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.status(200).send("User added successfully");
  } catch (error) {
    console.log("Error during signup:", error);
    res.status(500).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate(req.body);

    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(404).send("Invalid Credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid Credential");
    } else {
      console.log("User logged in successfully:", user);
      const token = jwt.sign({ _id: user._id }, "DEV@TINDER$790");
      res.cookie("authToken", token);
      return res.status(200).send(user);
    }
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).send(error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("authToken", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});

module.exports = authRouter;
