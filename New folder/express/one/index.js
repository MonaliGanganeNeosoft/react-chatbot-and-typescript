const express = require("express");

const app = express();
const port = 3000;
const path = require("path");

// const birds = require("./bird");

// app.use("/birds", birds);
const myLogger = function (req, res, next) {
  console.log("logger");
  next();
};
app.use(myLogger);

//-->middleware for requestTime method
const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};
app.use(requestTime);
app.get("/requestTime", (req, res, next) => {
  let responseText = "Hello Moni!<br>";
  responseText += `<small>Requested at:${req.requestTime}</small>`;
  res.send(responseText);
});

/* app.use("/static", express.static("public"));
//-->used this path in postman or browser to checking
//http://localhost:3000/static/download.jpg
 */

//-->or
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("hello worls");
});
app.post("/post", (req, res) => {
  res.send("from post");
});
app.put("/put", (req, res) => {
  res.send("hii put");
});
app.delete("/delete", (req, res) => {
  res.send("hii delete");
});
app.all("/all", (req, res) => {
  res.send("all request");
});
app.get("/user/:userID/book/:bookId", (req, res) => {
  res.send(req.params);
});

/* //->http://localhost:3000/user/:8/book/:8
//->result in params
//{
    "userID": ":8",
    "bookId": ":8"
} */

app.get("/flights/:from-:to", (req, res) => {
  res.send(req.params);
});
/* //->http://localhost:3000/flights/LAX-SFO
{
    from: "LAX",
    to: "SFO"
    } */

app.get("/plantae/:genus.:species", (req, res) => {
  res.send(req.params);
});

/* //->http://localhost:3000/plantae/Prunus.persica
{
    genus: "Prunus",
    species: "persica"
    } */

app.get("/user/:userId", (req, res) => {
  res.send(req.params);
});

/* //->http://localhost:3000/user/42
{
    userId: "42"
    } */

//routers handlers
app.get("/example/a", (req, res) => {
  res.send("res send from a");
});
//->more callback

app.get(
  "/example/b",
  (req, res, next) => {
    console.log("make sure call next method");
    next();
  },
  (req, res) => {
    res.send("calling from last callback after next method");
  }
);
app.get(
  "/person/:id",
  (req, res, next) => {
    console.log("simple first user");
    next();
  },
  (req, res) => {
    res.send("from second user");
  }
);

//arry of callback functions

const cb0 = function (req, res, next) {
  console.log("cb0");
  next();
};
const cb1 = function (req, res, next) {
  console.log("cb1");
  next();
};
const cb2 = function (req, res, next) {
  res.send("last called cb2");
};
app.get("/cb", [cb0, cb1, cb2]);

//->combinations of callbacks
const callBack0 = function (req, res, next) {
  console.log("cb00");
  next();
};
const callBack1 = function (req, res, next) {
  console.log("cb11");
  next();
};
app.get(
  "/callbackmix",
  [callBack0, callBack1],
  (req, res, next) => {
    console.log("calling from mix call last route");
    next();
  },
  (req, res, next) => {
    res.send("thats all");
  }
);

//res.download
app.get("/down", (req, res) => {
  res.download("moni.txt");
});
app.get("/download", (req, res) => {
  res.download("./public/download1.txt");
});
app.get("/download1", (req, res, next) => {
  res.download("./public/download.jpg");
});
/* res.download('/report-12345.pdf', 'report.pdf', function (err) {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
    } else {
      // decrement a download credit, etc.
    }
  }) */

app.get("/download2", (req, res) => {
  res.download("./public/download.jpg", function (err) {
    if (err) {
      console.log("err");
    } else {
      console.log("download successfully");
    }
    res.end();
  });
});

//->sending a file

app.get("/file/:name", function (req, res, next) {
  var options = {
    root: path.join(__dirname, "public"),
    dotfiles: "allow",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});
//app.route
app
  .route("/book")
  .get((req, res) => {
    res.send("get random book");
  })
  .put((req, res) => {
    res.send("put reaquest");
  })
  .post((req, res) => {
    res.send("post req");
  })
  .delete((req, res) => {
    res.send("delete req");
  });
//expres=>router

app.listen(port, () => {
  console.log(`${port} hii listenner`);
});
