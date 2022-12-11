const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./routes/dailogflowRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("listening on :5000");
});
