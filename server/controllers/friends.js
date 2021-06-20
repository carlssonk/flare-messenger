const Friend = require("../models/friend");
const User = require("../models/user");

module.exports.sendFriendRequest = async (req, res) => {
  const myId = req.user._id;
  const userId = req.query.id;

  await User.findOneAndUpdate(
    { _id: myId },
    { $addToSet: { "friends.sentRequests": userId } }
  );

  await User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { "friends.incomingRequests": myId } }
  );

  res.json({ userId });
};

module.exports.acceptRequest = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    {
      $addToSet: { "friends.friends": userId },
      $pull: { "friends.incomingRequests": userId },
    }
  );

  await User.findOneAndUpdate(
    { _id: userId },
    {
      $addToSet: { "friends.friends": myId },
      $pull: { "friends.sentRequests": myId },
    }
  );
};

module.exports.rejectRequest = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    { $pull: { "friends.incomingRequests": userId } }
  );
};

module.exports.cancelRequest = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    { $pull: { "friends.sentRequests": userId } }
  );
};

module.exports.removeFriend = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    { $pull: { "friends.friends": userId } }
  );
  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { "friends.friends": myId } }
  );
};

module.exports.showFriends = async (myId) => {
  const friends = await User.findById(myId)
    .populate("friends.friends", "-friends -_id -__v")
    .populate("friends.incomingRequests", "-friends -_id -__v")
    .populate("friends.sentRequests", "-friends -_id -__v");
  console.log(friends.friends);
};

module.exports.searchUsers = async (req, res) => {
  const { search } = req.query;
  const foundUsers = await User.find({
    username: { $regex: "^" + search },
  });
  // Remove myself from the array
  const foundMyIdx = foundUsers.findIndex(
    (e) => e.username === req.user.username
  );
  if (foundMyIdx >= 0) foundUsers.splice(foundMyIdx, 1);
  res.json({ foundUsers });
};

module.exports.incomingRequests = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(
    _id,
    "-username -email -_id -__v -friends.friends -friends.sentRequests"
  ).populate("friends.incomingRequests", "-friends -__v");

  const incoming = user.friends.incomingRequests;

  res.json({ incoming });
};

module.exports.sentRequests = async (req, res) => {
  const { id } = req.user._id;

  const friends = await User.findById(id).populate(
    "friends.incomingRequests",
    "-friends -_id -__v"
  );
};
