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
  // console.log(messages);

  return messages;
};

// function testImage(url, timeout = 5000) {
//   return new Promise(function (resolve, reject) {
//     var timer,
//       img = new Image();
//     img.onerror = img.onabort = function () {
//       clearTimeout(timer);
//       reject("error");
//     };
//     img.onload = function () {
//       clearTimeout(timer);
//       resolve("success");
//     };
//     timer = setTimeout(function () {
//       // reset .src to invalid URL so it stops previous
//       // loading, but doens't trigger new load
//       img.src = "//!!!!/noexist.jpg";
//       reject("timeout");
//     }, timeout);
//     img.src = url;
//   });
// }

// function checkURL(url) {
//   return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
// }

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

const wrapURLs = function (text, new_window) {
  const target = new_window === true || new_window == null ? "_blank" : "";
  return text.replace(URL_REGEX, function (url) {
    const protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
    const href = protocol_pattern.test(url) ? url : "http://" + url;
    return '<a href="' + href + '" target="' + target + '">' + url + "</a>";
  });
};

const sendGif = async (req, res) => {
  const { _id, username, avatar } = req.user;
  const chatId = req.params.id;
  const { url, source } = req.body;

  const messageDoc = await new Message({
    gif: { url, source },
    files: [],
    author: _id,
    chat: chatId,
  });
  await messageDoc.save();

  const author = { _id, username, avatar };

  const message = [
    {
      _id: messageDoc._id,
      createdAt: messageDoc.createdAt,
      gif: messageDoc.gif,
      files: messageDoc.files,
      showAvatar: true,
      isNewMessage: true,
      author,
    },
  ];

  socket.emitMessage(chatId, message);

  res.json({ message: message });
};

module.exports.sendMessage = async (req, res) => {
  console.log(req.query.type);
  if (req.query.type === "gif") return sendGif(req, res);
  const rawFiles = req.files;
  let text = req.body.text;
  if (!text) text = "";
  const chatId = req.params.id;
  const { _id, username, avatar } = req.user;

  const files = rawFiles.map(({ originalname, path }) => {
    return { originalname, path: path.replace("/upload", "/upload/w_600") };
  });

  let hasUrl = false;
  let stringTag = "";
  if (URL_REGEX.exec(text) !== null) {
    stringTag = wrapURLs(text);
    hasUrl = true;
  }

  const messageDoc = await new Message({
    text,
    hasUrl,
    stringTag,
    files,
    author: _id,
    chat: chatId,
  });
  await messageDoc.save();

  const author = { _id, username, avatar };

  const message = {
    _id: messageDoc._id,
    createdAt: messageDoc.createdAt,
    hasUrl: messageDoc.hasUrl,
    stringTag: messageDoc.stringTag,
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

const handleSpreadMessage = ({
  files,
  author,
  createdAt,
  text,
  hasUrl,
  stringTag,
  ...rest
}) => {
  let newArray = [];
  if (text)
    newArray.push({ author, createdAt, text, hasUrl, stringTag, ...rest });

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
        files: {
          $first: "$files",
        },
        lastMessageAt: {
          $first: "$createdAt",
        },
      },
    },
  ]);

  // Convert BSON to JSON
  chatMessages = JSON.parse(JSON.stringify(chatMessages));

  console.log(chatMessages);

  // Merge matching arrays
  const updatedChats = _.map(chats, function (item) {
    return _.extend(item, _.find(chatMessages, { _id: item._id }));
  });

  return updatedChats;
};
