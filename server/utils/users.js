const User = require("../models/user");

module.exports.updateLastActive = (id) => {
  User.findOneAndUpdate(id, {
    lastActive: new Date(),
  });
};
