const User = require("../models/user");

module.exports.sendFriendRequest = async (req, res) => {
  const myId = req.user._id;
  const userId = req.query.id;

  // Check first if user already sent friend request
  let checkUser = await User.findById(userId);
  if (checkUser.friends.sentRequests.includes(myId)) {
    await acceptRequest(myId, userId);
    // Exra properties we dont need to return to client
    checkUser.friends = undefined;
    checkUser.__v = undefined;
    return res.json({ checkUser, friends: true });
  }

  await User.findOneAndUpdate(
    { _id: myId },
    { $addToSet: { "friends.sentRequests": userId } }
  );

  let user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $addToSet: { "friends.incomingRequests": myId },
    }
  ).select("username email __id");

  res.json({ user });
};

module.exports.handleRequest = async (req, res) => {
  const myId = req.user._id;
  const { id: userId, action } = req.query;

  if (action === "accept") {
    await acceptRequest(myId, userId);
  }
  if (action === "reject") {
    await rejectRequest(myId, userId);
  }
  if (action === "cancel") {
    await cancelRequest(myId, userId);
  }

  res.json({ userId });
};

const acceptRequest = async (myId, userId) => {
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

const rejectRequest = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    { $pull: { "friends.incomingRequests": userId } }
  );
  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { "friends.sentRequests": myId } }
  );
};

const cancelRequest = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    { $pull: { "friends.sentRequests": userId } }
  );

  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { "friends.incomingRequests": myId } }
  );
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

module.exports.friendsAndPending = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id, "-username -email -_id -__v")
    .populate("friends.sentRequests", "-friends -__v")
    .populate("friends.friends", "-friends -__v")
    .populate("friends.incomingRequests", "-friends -__v");

  const incoming = user.friends.incomingRequests;
  const sent = user.friends.sentRequests;
  const sentIncomingAndFriends = [
    ...incoming,
    ...sent,
    ...user.friends.friends,
  ];

  res.json({ sentIncomingAndFriends, incoming, sent });
};


module.exports.getFriends = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id).populate(
    "friends.friends",
    "-friends -__v"
  );

  res.json({ friends: user.friends.friends });
};


module.exports.removeFriend = async (req, res) => {
  // await User.findOneAndUpdate(
  //   { _id: myId },
  //   { $pull: { "friends.friends": userId } }
  // );
  // await User.findOneAndUpdate(
  //   { _id: userId },
  //   { $pull: { "friends.friends": myId } }
  // );
};