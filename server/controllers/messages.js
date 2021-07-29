const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const _ = require("lodash");
// const { showChats } = require("./chats");

module.exports.getMessages = async (chatId) => {
  const messages = await Message.find(
    { chat: chatId },
    "-chat -__v -updatedAt"
  ).populate(
    "author",
    "-__v -createdAt -updatedAt -friends -email -chats -name"
  );

  console.log(chatId);
  console.log("messages");
  console.log(messages);
  console.log("messages");

  return messages;
};

module.exports.sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const myId = req.user._id;

  const message = await new Message({ text, chat: chatId, author: myId });
  await message.save();

  res.json({ text });
};

module.exports.getLastMessages = async (chats) => {
  const list = chats.map((e) => e._id);

  let chatMessages = await Message.aggregate([
    { $match: { chat: { $in: list } } },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$chat",
        text: {
          $first: "$text",
        },
        createdAt: {
          $first: "$createdAt",
        },
      },
    },
  ]);

  // Stringify so _id works
  chats = JSON.parse(JSON.stringify(chats));
  chatMessages = JSON.parse(JSON.stringify(chatMessages));

  // Merge matching arrays
  const updatedChats = _.map(chats, function (item) {
    return _.extend(item, _.find(chatMessages, { _id: item._id }));
  });

  return updatedChats;
};
