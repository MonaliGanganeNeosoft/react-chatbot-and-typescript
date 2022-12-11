const empSchema = require("../db/empSchema");
exports.addEmps = async (query) => {
  try {
    let EmpData = empSchema(query);
    const emp = await EmpData.save();
    console.log(emp, "service");
    return emp;
  } catch (e) {
    throw Error("Error while add user");
  }
};
