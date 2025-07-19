const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


//profile
userRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("Error fetching profile:", );
    res.status(500).send(error.message);
  }
});

//update user details
userRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const data = req.body;
  // const userId = req.body.userId;
  try {
    const ALLOWED_FIELDS = [
      // "userId",
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

    console.log("Updating user with data:", data);
    console.log("User ID:", req.user._id);
    const updatedData = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: data },
      { new: true }         
    );
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).send(error.message);
  }
});

userRouter.get("/feed", async (req, res) => {
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

module.exports = userRouter;