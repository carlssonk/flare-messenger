const Friend = require("../models/friend");
const User = require("../models/user");

module.exports.sendFriendRequest = async (myId, userId) => {
  await User.findOneAndUpdate(
    { _id: myId },
    { $addToSet: { "friends.sentRequests": userId } }
  );

  await User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { "friends.incomingRequests": myId } }
  );
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
