const User = require("../models/user");
const passport = require("passport");
const { cloudinary } = require("../cloudinary");
const { randomHexGenerator } = require("../utils/generateAvatar");
const { updateLastActive } = require("../utils/users");

module.exports.user = (req, res) => {
  if (!req.isAuthenticated()) return res.json(null);
  const {
    _id,
    email,
    username,
    name,
    chats,
    avatar: { hexCode, path = null },
  } = req.user;
  updateLastActive(_id);
  const chatIdList = chats.map((e) => e.chat);
  res.json({
    id: _id,
    email,
    username,
    name,
    avatar: { hexCode, path },
    chats: chatIdList,
  });
};

module.exports.updateName = async (req, res) => {
  const myId = req.user._id;
  const { name } = req.body;
  await User.findOneAndUpdate({ _id: myId }, { $set: { name } });
  res.json({ name });
};

module.exports.newAvatar = async (req, res) => {
  console.log("New avatar");
  const myId = req.user._id;
  const resize = JSON.parse(req.body.resize);

  console.log(req.file);

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

  // Delete old avatar on cloudinary
  cloudinary.uploader.destroy(user.avatar.filename);

  res.json({ path });
};

module.exports.deleteAvatar = async (req, res) => {
  const myId = req.user._id;

  const hexCode = randomHexGenerator();

  const user = await User.findOneAndUpdate(
    { _id: myId },
    {
      $set: {
        "avatar.filename": "",
        "avatar.path": "",
        "avatar.hexCode": hexCode,
      },
    }
  );

  // Delete old avatar on cloudinary
  cloudinary.uploader.destroy(user.avatar.filename);

  res.json({ hexCode });
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
    const hexCode = randomHexGenerator();
    const user = new User({
      lastActive: new Date(),
      email,
      username,
      name: username,
      "avatar.hexCode": hexCode,
      chats: [],
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      const {
        _id,
        email,
        username,
        chats,
        avatar: { path = null },
      } = registeredUser;
      return res.json({
        id: _id,
        email,
        username,
        name: username,
        chats,
        avatar: { hexCode, path },
      });
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
      const {
        _id,
        email,
        username,
        name,
        chats,
        avatar: { hexCode, path = null },
      } = user;
      updateLastActive(_id);
      const chatIdList = chats.map((e) => e.chat);
      return res.json({
        id: _id,
        email,
        username,
        name,
        chats: chatIdList,
        avatar: { hexCode, path },
      });
    });
  })(req, res, next);
};

module.exports.logout = (req, res) => {
  req.logout();
  res.send("ok");
};
