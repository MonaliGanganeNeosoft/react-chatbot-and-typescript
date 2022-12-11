const mongoose = require("mongoose");
const empSchema = new mongoose.Schema({
  empname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: { String },
  },
  mobileno: {
    type: Number,
  },
});
module.exports = mongoose.model("empdata", empSchema);
