const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/MoniNeovi";
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("Mongodb connected");
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = connectDB;
