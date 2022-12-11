const express = require("express");
const router = express.Router();
router.use((req, res, next) => {
  console.log("Time ", Date.now());
  next();
});

router.get("/", (req, res, next) => {
  res.send("birds home page");
});
router.get("/about", (req, res, next) => {
  res.send("from birds about page");
});
module.exports = router;
