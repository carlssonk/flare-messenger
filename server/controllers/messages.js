const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const _ = require("lodash");
const mongoose = require("mongoose");
const socket = require("../socket");
const { v4: uuidv4 } = require("uuid");

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
  const rawFiles = req.files;
  const text = req.body.text;
  const chatId = req.params.id;
  const { _id, username, avatar } = req.user;

  const files = rawFiles.map(({ originalname, path }) => {
    return { originalname, path: path.replace("/upload", "/upload/w_600") };
  });

  const messageDoc = await new Message({
    text,
    files,
    author: _id,
    chat: chatId,
  });
  await messageDoc.save();

  const author = { _id, username, avatar };

  const message = {
    _id: messageDoc._id,
    createdAt: messageDoc.createdAt,
    text: messageDoc.text,
    files: messageDoc.files,
    showAvatar: true,
    isNewMessage: true,
    author,
  };

  const spreadMessage = handleSpreadMessage(message);

  socket.emitMessage(chatId, spreadMessage);

  res.json({ message: spreadMessage });
};

const handleSpreadMessage = ({ files, author, createdAt, text, ...rest }) => {
  let newArray = [];
  if (text) newArray.push({ author, createdAt, text, ...rest });

  for (let file of files) {
    newArray.push({
      author,
      createdAt,
      file,
      isNewMessage: true,
      _id: uuidv4(),
    });
  }
  return newArray;
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
