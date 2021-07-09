const User = require("../models/user");
const passport = require("passport");
const { cloudinary } = require("../cloudinary");

module.exports.user = (req, res) => {
  if (!req.isAuthenticated()) return res.json(null);
  const { _id, email, username, name } = req.user;
  console.log(username);
  res.json({ id: _id, email, username, name });
};

module.exports.newAvatar = async (req, res) => {
  const myId = req.user._id;
  const resize = JSON.parse(req.body.resize);

  const path = req.file.path.replace(
    "/upload",
    `/upload/ar_1,c_crop,w_${resize.ZOOM},x_${resize.FindX},y_${resize.FindY}/w_200`
  );
  const filename = req.file.filename;

  const user = await User.findOneAndUpdate(
    { _id: myId },
    {
      $set: { "avatar.filename": filename, "avatar.path": path },
    }
  );

  console.log(user);

  // Delete old avatar on cloudinary
  cloudinary.uploader.destroy(user.avatar.filename);

  res.json({ path });
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
    res.json({ foundUsername: foundUsername ? true : false });
  }
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, name: username });
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
