const Chat = require("../models/chat");
const User = require("../models/user");

module.exports.showChats = async (req, res) => {
  const myId = req.user._id;

  const user = await User.findById(
    myId,
    "-friends -__v -username -email -updatedAt -_id"
  ).populate("chats", "-__v -createdAt -updatedAt");

  // Filter chats that user has created or that is visible
  const chats = user.chats.filter(
    (e) => e.author.toString() === myId.toString() || e.isVisible
  );

  res.json({ chats });
};

module.exports.createChat = async (req, res) => {
  const { userId, isPrivate } = req.body;
  const myId = req.user._id;

  const chat = await new Chat({
    author: myId,
    users: [myId, userId],
    isPrivate,
    isVisible: false,
  });
  await chat.save();

  // Add chat to users
  await User.updateMany(
    { _id: { $in: [myId, userId] } },
    {
      $addToSet: { chats: chat._id },
    }
  );

  res.json({ chatId: chat._id });
};

module.exports.showChat = async (req, res) => {
  const myId = req.user._id;
  const { id } = req.params;

  const chat = await Chat.findById(id).populate(
    "users",
    "-email -__v -chats -friends"
  );

  const friends = chat.users.filter((e) => {
    return e._id.toString() !== myId.toString();
  });

  res.json({ friends });
};
