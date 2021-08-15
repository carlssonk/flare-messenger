const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const _ = require("lodash");
const mongoose = require("mongoose");
const socket = require("../socket");
const {
  handleSpreadMessages,
  createMessageObject,
  retrieveStringInfo,
} = require("../utils/messages");

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

module.exports.sendMessage = async (req, res) => {
  const { _id: userId, username, avatar } = req.user;
  const chatId = req.params.id;

  const text = req.body.text;
  const gif = JSON.parse(req.body.gif);
  const rawFiles = req.files || [];
  const files = rawFiles.map(({ originalname, path }) => {
    return { originalname, path: path.replace("/upload", "/upload/w_600") };
  });

  const { stringTag } = retrieveStringInfo(text);

  const messageDoc = new Message({
    ...(text && { text }),
    ...(stringTag && { stringTag }),
    ...(gif && { gif: { url: gif.url, source: gif.source } }),
    files,
    author: userId,
    chat: chatId,
  });
  await messageDoc.save();

  const message = createMessageObject(messageDoc, { userId, username, avatar });

  const spreadMessage = handleSpreadMessages([message], true);

  socket.emitMessage(chatId, spreadMessage);

  res.json({ message: spreadMessage });
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
        files: {
          $first: "$files",
        },
        gif: {
          $first: "$gif",
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
