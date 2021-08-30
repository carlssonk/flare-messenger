const User = require("../models/user");

module.exports.updateLastActive = async (id) => {
  await User.findByIdAndUpdate(id, {
    $set: { lastActive: new Date() },
  });

  // console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
  // console.log(user);
  // console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
};
