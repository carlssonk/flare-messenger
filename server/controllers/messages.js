const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const _ = require("lodash");
const mongoose = require("mongoose");

module.exports.getMessages = async (chatId, trashedAt) => {
  let messages;

  if (trashedAt) {
    messages = await Message.find(
      { chat: chatId, createdAt: { $gt: trashedAt } },
      "-chat -__v -updatedAt"
    ).populate(
      "author",
      "-__v -createdAt -updatedAt -friends -email -chats -name"
    );
  } else {
    messages = await Message.find(
      { chat: chatId },
      "-chat -__v -updatedAt"
    ).populate(
      "author",
      "-__v -createdAt -updatedAt -friends -email -chats -name"
    );
  }

  return messages;
};

module.exports.sendMessage = async (message, user) => {
  const { text, file, chatId } = message;

  const messageDoc = await new Message({
    text,
    author: user._id,
    chat: chatId,
  });
  await messageDoc.save();

  const author = {
    _id: user._id,
    username: user.username,
    avatar: {
      filename: user.avatar.filename,
      hexCode: user.avatar.hexCode,
      path: user.avatar.path,
    },
  };

  const formatMessage = {
    _id: messageDoc._id,
    createdAt: messageDoc.createdAt,
    text: messageDoc.text,
    author,
  };

  return formatMessage;
};

module.exports.getLastMessages = async (chats) => {
  const list = chats.map((e) => mongoose.Types.ObjectId(e._id));

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
        lastMessageAt: {
          $first: "$createdAt",
        },
      },
    },
  ]);

  // Convert BSON to JSON
  chatMessages = JSON.parse(JSON.stringify(chatMessages));

  // Merge matching arrays
  const updatedChats = _.map(chats, function (item) {
    return _.extend(item, _.find(chatMessages, { _id: item._id }));
  });

  return updatedChats;
};
