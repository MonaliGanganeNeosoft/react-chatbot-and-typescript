const express = require("express");
const router = express.Router();

const { Add_EMP } = require("../Controller/empController");

router.post("/addemp", Add_EMP);
module.exports = router;
