const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "one" },
  { id: 2, name: "two" },
];
app.get("/", (req, res) => {
  res.send("Hello world!!");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});
app.post("/api/courses", (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    //400 Bad request
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("the course is not found with this id");
  res.send(course);
});
app.get("/api/courses/posts/:year/:month", (req, res) => {
  res.send(req.query);
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// app.post();
// app.put();
// app.delete();
