const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const _ = require("lodash");
// const socket = require("../socket");
// const { showChats } = require("./chats");

module.exports.getMessages = async (chatId) => {
  const messages = await Message.find(
    { chat: chatId },
    "-chat -__v -updatedAt"
  ).populate(
    "author",
    "-__v -createdAt -updatedAt -friends -email -chats -name"
  );

  return messages;
};

module.exports.sendMessage = async (message, chatId, myId) => {
  console.log("message");
  const messageDoc = await new Message({
    text: message,
    chat: chatId,
    author: myId,
  });
  await messageDoc.save();

  return messageDoc;
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
