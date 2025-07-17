const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const { userSchema, loginSchema } = require("./utils/validatations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
      return res.status(200).send("Login successful");
    }
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).send(error.message);
  }
});

// get user details
app.get("/user", async (req, res) => {
  try {
    // const user = await User.find({ _id: req.body.userId });
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).send(error.message);
  }
});

// get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Fetched users:", users);
    if (!users || users.length === 0) {
      return res.status(404).send("No users found");
    }
    res.status(200).send(users);
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).send(error.message);
  }
});

//update user details
app.patch("/update-user", async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;
  try {
    const ALLOWED_FIELDS = [
      "userId",
      "photoUrl",
      "gender",
      "firstName",
      "lastName",
      "age",
      "about",
      "skills",
    ];
    const updateFields = Object.keys(data).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );
    if (!updateFields) {
      throw new Error("Invalid fields to update");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).send(error.message);
  }
});

//profile

app.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.authToken;
    console.log("Cookie received:", cookie);
    if(!token) {
      return res.status(401).send("Unauthorized");
    }
    const isTokenValid = jwt.verify(token, "DEV@TINDER$790");
    console.log("Is token valid:", isTokenValid);
    if (!isTokenValid) {
      return res.status(401).send("Unauthorized");
    }
    const user= await User.findById(isTokenValid._id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("Error fetching profile:", );
    res.status(500).send(error.message);
  }
});

connectDb().then(() => {
  console.log("Database connected successfully");
  app.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
});
