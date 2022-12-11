const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const PORT = 8899;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/api/emp", employeeRoutes);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Work on ${PORT}`);
});
