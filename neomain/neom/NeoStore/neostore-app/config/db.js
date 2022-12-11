const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/vinaEcom";
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = connectDB;
