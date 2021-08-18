import { v4 as uuidv4 } from "uuid";

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

export const contentStateEmoji = (emoji, editorState, Modifier) => {
  let contentState = editorState.getCurrentContent();
  let targetRange = editorState.getSelection();
  return Modifier.insertText(contentState, targetRange, emoji.native);
};

export const enableChat = async (location, user) => {
  const chatId = location.pathname.replace("/chat/", "");
  if (!user.chats.includes(chatId)) return;
  await fetch("/api/chats/enable", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
    }),
  });
};

export const handleSpreadMessage = ({
  files,
  author,
  createdAt,
  text,
  stringTag,
  gif,
  ...rest
}) => {
  let newArray = [];
  if (text || gif)
    newArray.push({ author, createdAt, text, stringTag, gif, ...rest });

  for (let file of files) {
    newArray.push({
      author,
      createdAt,
      file,
      _id: uuidv4(),
      isLoading: true,
      isNewMessage: true,
    });
  }
  return newArray;
};

const wrapURLs = function (text, new_window) {
  const target = new_window === true || new_window == null ? "_blank" : "";
  return text.replace(URL_REGEX, function (url) {
    const protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
    const href = protocol_pattern.test(url) ? url : "http://" + url;
    return '<a href="' + href + '" target="' + target + '">' + url + "</a>";
  });
};

const retrieveStringInfo = (text) => {
  let stringTag = "";
  if (URL_REGEX.exec(text) !== null) {
    stringTag = wrapURLs(text);
  }
  return { stringTag };
};

export const createMessageUI = (user, text, files, gif) => {
  const { avatar, username, id } = user;
  const author = { avatar, username, _id: id };

  const copyFiles = [...files];
  const newFiles = copyFiles.map(({ url, file }) => {
    return { path: url, originalname: file.name };
  });

  const { stringTag } = retrieveStringInfo(text);

  const message = createMessageObject(
    { stringTag, gif, text, files: newFiles },
    author
  );

  return message;
};

const createMessageObject = ({ stringTag, text, files, gif }, author) => {
  return {
    _id: uuidv4(),
    createdAt: new Date(),
    showAvatar: true,
    isNewMessage: true,
    isLoading: true,
    author,
    files,
    ...(text && { text }),
    ...(stringTag && { stringTag }),
    ...(gif && { gif }),
  };
};

export const listenSubmit = (e) => {
  if (e.keyCode === 13)
    if (!e.shiftKey) {
      return true;
    }
  return false;
};

export const handleShowAvatar = (initMessages) => {
  let lastId;
  let idArr = [];
  for (let i = 0; i < initMessages.length; i++) {
    if (initMessages[i].author._id === lastId) {
      const startDate = new Date(initMessages[i].createdAt).getTime();
      const endDate = new Date(initMessages[i - 1].createdAt).getTime();

      if ((endDate - startDate) / 1000 > 60) {
        idArr.push(initMessages[i]._id);
      }
    } else {
      idArr.push(initMessages[i]._id);
    }

    lastId = initMessages[i].author._id;
  }

  const newMsgs = initMessages.map((obj) => {
    if (idArr.includes(obj._id)) {
      return { ...obj, showAvatar: true };
    } else {
      return { ...obj, showAvatar: false };
    }
  });

  return newMsgs;
};

const bubbleDown = (isMyMessage) => {
  return isMyMessage
    ? { borderRadius: "20px 20px 4px 20px" }
    : { borderRadius: "20px 20px 20px 4px" };
};

const bubbleUp = (isMyMessage) => {
  return isMyMessage
    ? { borderRadius: "20px 4px 20px 20px" }
    : { borderRadius: "4px 20px 20px 20px" };
};

const bubbleMid = (isMyMessage) => {
  return isMyMessage
    ? { borderRadius: "20px 4px 4px 20px" }
    : { borderRadius: "4px 20px 20px 4px" };
};

const handleBubbleRadius = (message, messages, user) => {
  if (!message) return;
  const isMy = message.author._id === user.id;

  const msgs = [...messages].reverse();
  const idx = msgs.findIndex((e) => e._id === message._id);

  const prevMessage = msgs[idx - 1];
  const nextMessage = msgs[idx + 1];
  const currentId = message.author._id;

  if (!prevMessage && !nextMessage) return;

  if (prevMessage && message.showAvatar) {
    // Handle LAST message of block
    if (currentId === prevMessage.author._id && !prevMessage.showAvatar)
      return bubbleUp(isMy);
  }

  // Handle TOP & MIDDLE messages of block
  if (prevMessage && nextMessage && !message.showAvatar) {
    if (
      currentId === prevMessage.author._id &&
      currentId === nextMessage.author._id
    ) {
      if (prevMessage.showAvatar) return bubbleDown(isMy);
      return bubbleMid(isMy);
    }

    if (currentId === nextMessage.author._id) return bubbleDown(isMy);
  }

  // Handle FIRST message
  if (nextMessage && message._id === msgs[0]._id) {
    if (currentId === nextMessage.author._id) {
      const myDate = new Date(message.createdAt).getTime();
      const nextDate = new Date(nextMessage.createdAt).getTime();
      if ((nextDate - myDate) / 1000 < 60) {
        return bubbleDown(isMy);
      }
    }
  }
};

export const handleAddBubble = (msgs, user) => {
  let bubbleArray = [];
  for (let message of msgs) {
    const res = handleBubbleRadius(message, msgs, user);
    bubbleArray.push(res);
  }
  const bubbledMsgs = msgs.map((obj, idx) => {
    return { ...obj, ...bubbleArray[idx] };
  });
  return bubbledMsgs;
};

export const linkStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(URL_REGEX, contentBlock, callback);
};

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

export const isInputEmpty = (text, files) => {
  return text.replace(/\s/g, "").length > 0 || files.length > 0 ? true : false;
};
