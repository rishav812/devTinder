const User = require("../models/user");
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  console.log("Admin1 isAuthorized:", isAuthorized);
  if (!isAuthorized) {
    return res.status(401).send("Forbidden");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).send("Unauthorized User");
    }
    console.log("User auth token:", token);
    const isAuthorized = jwt.verify(token, "DEV@TINDER$790");
    console.log("User isAuthorized:", isAuthorized);
    if (!isAuthorized) {
      throw new Error("Unauthorized User");
    } else {
      const user = await User.findById(isAuthorized._id);
      req.user = user;
      next();
    }
  } catch (error) {
    console.log("Error in userAuth middleware:", error);
    res.status(401).send("Unauthorized User");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
