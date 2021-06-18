const User = require("../models/user");
const passport = require("passport");

module.exports.user = (req, res) => {
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) return res.json(null);
  const { _id, email, username } = req.user;
  res.json({ id: _id, email, username });
};

module.exports.checkAvailability = async (req, res) => {
  if (req.query["email"]) {
    const { email } = req.query;
    const foundEmail = await User.findOne({ email });
    res.json({ foundEmail: foundEmail ? true : false });
  }
  if (req.query["username"]) {
    const { username } = req.query;
    const foundUsername = await User.findOne({ username });
    console.log(foundUsername);
    res.json({ foundUsername: foundUsername ? true : false });
  }
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      const { _id, email, username } = registeredUser;
      return res.json({ id: _id, email, username });
    });
  } catch (e) {
    console.log("ERROR " + e.message);
    res.redirect("/");
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) return res.json({ error: "Invalid username or password." });

    req.login(user, function (err) {
      if (err) return next(err);
      const { _id, email, username } = user;
      return res.json({ id: _id, email, username });
    });
  })(req, res, next);
};

module.exports.logout = (req, res) => {
  req.logout();
  res.send("ok");
};
