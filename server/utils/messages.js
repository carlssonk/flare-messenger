const { v4: uuidv4 } = require("uuid");
const Message = require("../models/message");

module.exports.handleReturnMessagesCount = async (user, id) => {
  const trashedAt = user.chats.find((e) => e.chat.toString() === id).trashedAt;

  const messages = await Message.find({
    chat: id,
    ...(trashedAt && { createdAt: { $gt: trashedAt } }),
  });

  let count = 0;
  for (let { files, text } of messages) {
    if (files.length > 0) {
      if (text) {
        count += files.length + 1;
      } else {
        count += files.length;
      }
    } else {
      count++;
    }
  }

  console.log(count);

  return count;
};

const handleSpreadMessages = (messages, isNewMessage) => {
  let newArray = [];

  for (const {
    text,
    stringTag,
    gif,
    files,
    author,
    createdAt,
    ...rest
  } of messages) {
    if (text || gif)
      newArray.push({
        ...(gif && { gif }),
        ...(stringTag && { stringTag }),
        ...(text && { text }),
        author,
        createdAt,
        ...rest,
      });

    for (const file of files) {
      newArray.push({
        author,
        createdAt,
        file,
        isNewMessage,
        _id: uuidv4(),
      });
    }
  }
  return newArray;
};

module.exports.handleSpreadMessages = (messages, isNewMessage) => {
  let newArray = [];

  for (const {
    text,
    stringTag,
    gif,
    files,
    author,
    createdAt,
    ...rest
  } of messages) {
    if (text || gif)
      newArray.push({
        ...(gif && { gif }),
        ...(stringTag && { stringTag }),
        ...(text && { text }),
        author,
        createdAt,
        ...rest,
      });

    for (const file of files) {
      newArray.push({
        author,
        createdAt,
        file,
        isNewMessage,
        _id: uuidv4(),
      });
    }
  }
  return newArray;
};

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

module.exports.retrieveStringInfo = (text) => {
  let stringTag = "";
  if (URL_REGEX.exec(text) !== null) {
    stringTag = wrapURLs(text);
  }
  return { stringTag };
};

module.exports.createMessageObject = (
  { _id, createdAt, stringTag, text, files, gif },
  { userId, username, avatar }
) => {
  return {
    _id,
    createdAt,
    showAvatar: true,
    isNewMessage: true,
    author: { _id: userId, username, avatar },
    files,
    ...(gif.url && { gif }),
    ...(stringTag && { stringTag }),
    ...(text && { text }),
  };
};

const getMessages = async (chatId, trashedAt, skip, limit) => {
  console.log("-----");
  console.log(skip);
  const messages = await Message.find(
    { chat: chatId, ...(trashedAt && { createdAt: { $gt: trashedAt } }) },
    "-chat -__v -updatedAt"
  )
    .populate(
      "author",
      "-__v -createdAt -updatedAt -friends -email -chats -name"
    )
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  // console.log(messages.length);

  return messages.reverse();
};

module.exports.handleReturnMessages = async (
  user,
  id,
  skip = 0,
  limit = 40
) => {
  const trashedAt = user.chats.find((e) => e.chat.toString() === id).trashedAt;

  const messages = await getMessages(id, trashedAt, skip, limit);

  const parseMsgs = JSON.parse(JSON.stringify(messages)).reverse();

  const msgs = handleSpreadMessages(parseMsgs, false);

  return msgs.reverse();
};
