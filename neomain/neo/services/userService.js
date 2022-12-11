const userSchema = require("../db/userSchema");
exports.addUser = async (query) => {
  try {
    let UserData = userSchema(query);
    const user = await UserData.save();
    return user;
  } catch (e) {
    throw Error("Erroe while add user");
  }
};
