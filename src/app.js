const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  console.log("Testing is performing");
  res.send("Hello from server");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
