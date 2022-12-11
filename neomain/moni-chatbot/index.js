const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config/keys");
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./routes/dailogflowRoutes")(app);
if (process.env.NODE_ENV === "production") {
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("listening on :5000");
});
