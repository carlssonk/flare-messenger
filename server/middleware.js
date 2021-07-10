const { validationResult } = require("express-validator");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

module.exports.checkAvailability = async (req, res, next) => {
  if (req.body["username"]) {
    const { username } = req.body;
    const foundUsername = await User.findOne({ username });
    if (foundUsername) {
      throw new ExpressError("Username is taken.", 400);
    }
  }

  if (req.body["email"]) {
    const { email } = req.body;
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      console.log("found email");
      throw new ExpressError("Email adress already in use.", 400);
    }
  }

  next();
};

module.exports.validateUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const array = errors.array();
    const formatErrors = [];
    array.map((err) => formatErrors.push({ [err.param]: err.msg }));
    const filterErrors = [];
    for (let err of formatErrors.reverse()) {
      if (filterErrors.some((e) => Object.entries(err)[0][0] in e)) continue;
      filterErrors.push(err);
    }
    throw new ExpressError(filterErrors, 400);
  } else {
    next();
  }
};
