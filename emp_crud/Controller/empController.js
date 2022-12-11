const bcrypt = require("bcrypt");
const saltRounds = 10;
const Emp = require("../services/empService");

const Add_EMP = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    let password = req.body.password;
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log(hash);
    const emp = await Emp.addEmps({
      empname: data.empname,
      email: data.email,
      password: hash,
      mobileno: data.mobileno,
    });
    console.log(emp, "hii");
    res.status(200).json({
      err: 0,
      msg: `${data.empname} ${data.email} Regitered successfully`,
    });
  } catch {
    return res.status(400).json({ err: 1, msg: "email must be differnt" });
  }
};
module.exports = { Add_EMP };
