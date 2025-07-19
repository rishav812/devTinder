const express= require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");


const requestRouter = express.Router();

//profile
requestRouter.get("/profile", userAuth, async (req, res) => {
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

module.exports = requestRouter;