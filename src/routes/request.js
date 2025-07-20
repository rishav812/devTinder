const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");
const { connectionSchema } = require("../utils/validatations");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.userId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      const {error, value} = await connectionSchema.validateAsync({
        fromUserId,
        toUserId,
        status,
      })

      if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).send(error.details[0].message);
      }

      if(String(fromUserId) === toUserId) {
        return res.status(400).send("You cannot send a request to yourself");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
      });

      if (existingRequest) {
        return res.status(400).send("Connection request already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.status(200).send("Connection request sent successfully");
    } catch (error) {
      console.log("Error sending connection request:", error);
      res.status(500).send(error.message);
    }
  }
);

module.exports = requestRouter;
