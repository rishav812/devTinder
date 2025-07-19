const express = require("express");
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");


const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", requestRouter);


connectDb().then(() => {
  console.log("Database connected successfully");
  app.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
});
