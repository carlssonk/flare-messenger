const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/flare-chat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const registerUser = async () => {
  const user = new User({ email: "oliver@gmail.com", username: "oliverost" });
  const newUser = await User.register(user, "password123");
  console.log(newUser);
};

// registerUser();

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
  console.log("SUCCESFULLY DELETED USER");
};

const deleteAllUsers = async () => {
  await User.deleteMany();
};

// deleteAllUsers();

const {
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  removeFriend,
  showFriends,
} = require("./controllers/friends");

const oliverId = "60cd0cbbebc58542d8e08edb";
const bobId = "60cd0cebebc58542d8e08edc";
const alexId = "60cd0cf9ebc58542d8e08edd";

// const removeAllChats = async () => {
//   await User.updateMany({
//     $set: { chats: [] },
//   });
// };

// removeAllChats();

// OLIVER

// sendFriendRequest(oliverId, alexId);
// rejectRequest(alexId, oliverId);
// acceptRequest(alexId, oliverId);
// cancelRequest(oliverId, alexId);
// removeFriend(oliverId, bobId);

// BOB

// const deleteAllFriends = async () => {
//   await Friend.deleteMany();
//   console.log("DELETED");
// };

// showFriends(oliverId);
// showFriends(bobId);
// showFriends(alexId);

// deleteAllFriends();

// const deleteAllFriends = async (myId, userId) => {
//   // const { myId, userId } = req.body;

//   const myDoc = await Friend.deleteMany({
//     requester: myId,
//     recipient: userId,
//   });
//   const userDoc = await Friend.findOneAndRemove({
//     recipient: myId,
//     requester: userId,
//   });
//   const updateUserA = await User.findOneAndUpdate(
//     { _id: myId },
//     { $pull: { friends: myDoc._id } }
//   );
//   const updateUserB = await User.findOneAndUpdate(
//     { _id: userId },
//     { $pull: { friends: userDoc._id } }
//   );
// };
