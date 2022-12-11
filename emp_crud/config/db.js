const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/emp_Moni";
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MOgodb connected");
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = connectDB;
