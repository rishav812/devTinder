const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://kumarishav812:Test123@cluster0.smzsaca.mongodb.net/devTinder?retryWrites=true&w=majority&appName=cluster0"
  );
};

module.exports = {
    connectDb
}