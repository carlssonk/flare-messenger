const { v4: uuidv4 } = require("uuid");

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
