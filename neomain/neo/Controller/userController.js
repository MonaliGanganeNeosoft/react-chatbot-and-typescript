const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../services/userService");

const ADD_USER = async (req, res) => {
  try {
    let data = req.body;
    let password = req.body.password;
    const hash = bcrypt.hashSync(password, saltRounds);
    const user = await User.addUser({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hash,
      mobileno: data.mobileno,
      profilepic: "dummy.png",
      social: false,
    });
    res.status(200).json({
      err: 0,
      msg: `${data.firstname} ${data.lastname} Registered successfully`,
    });
  } catch {
    return res.status(400).json({ err: 1, msg: "dublicate email" });
  }
};
module.exports = { ADD_USER };
