const express = require("express");
const cors = require("cors");
// const { jwt } = require("express-jwt");
var { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");

const app = express();
app.use(cors());

var verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-a3vlyj5s.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "this is unique identifier",
  issuer: "https://dev-a3vlyj5s.us.auth0.com/",
  algorithms: ["RS256"],
}).unless({ path: ["/"] });

app.use(verifyJwt);

app.get("/", (req, res) => {
  res.send("hello from index route");
});
app.get("/protected", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const response = await axios.get(
      "https://dev-a3vlyj5s.us.auth0.com/userinfo",
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userinfo = response.data;
    console.log(userinfo);
    res.send(userinfo);
  } catch (error) {
    console.log(message.error);
  }
});

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).send(message);
});
app.listen(4000, () => console.log("server is on port 4000"));
