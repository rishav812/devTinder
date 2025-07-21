const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");
const { connectionSchema } = require("../utils/validatations");
const ConnectionRequest = require("../models/connectionRequest");
const { requestViewSchema } = require("../utils/validatations");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.userId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      const { error, value } = await connectionSchema.validateAsync({
        fromUserId,
        toUserId,
        status,
      });

      if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).send(error.details[0].message);
      }

      if (String(fromUserId) === toUserId) {
        return res.status(400).send("You cannot send a request to yourself");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const status = req.params.status;
    const requestId = req.params.requestId;
    const loggedInUser = req.user._id;
    const { error, value } = requestViewSchema.validate({ requestId, status });
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }
    const existingRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser,
      status: "interested",
    });
    if (!existingRequest) {
      return res.status(404).send("Connection request not found");
    }
    existingRequest.status = status;
    await existingRequest.save();
    res
      .status(200)
      .json({ message: "Connection request reviewed successfully" });
  }
);



module.exports = requestRouter;
