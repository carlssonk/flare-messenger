const Chat = require("../models/chat");
const User = require("../models/user");
const { getMessages, getLastMessages } = require("./messages");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

module.exports.showChats = async (req, res) => {
  const myId = req.user._id;

  const user = await User.findById(
    myId,
    "-friends -__v -username -email -updatedAt -_id"
  ).populate({
    path: "chats.chat",
    select: "-__v -createdAt -updatedAt -author",
    populate: {
      path: "users",
      model: "User",
      match: { _id: { $ne: myId } },
      select: "-_id -__v -friends -createdAt -updatedAt -email -chats",
    },
  });

  // Filter chats that are visible
  const visibleChats = user.chats.filter((e) => e.chat.isVisible);

  // Convert BSON to JSON
  const chatToJSON = JSON.parse(JSON.stringify(visibleChats));

  const formatChats = chatToJSON.map(({ chat, ...rest }) => {
    return { ...chat, ...rest };
  });

  // Fetch last messages of each chat
  const chatsWithMessages = await getLastMessages(formatChats);

  const chats = chatsWithMessages.map((e) => ({
    ...e,
    lastMessageTime: e.lastMessageAt
      ? moment(e.lastMessageAt).fromNow(true)
      : "",
  }));

  // console.log(chats);

  if (hasTrashedChatGottenMessage(chats)) {
    return unTrashChats(res, myId, chats);
  }

  res.json({ chats });
};

const hasTrashedChatGottenMessage = (chats) => {
  return chats.some((e) => e.status === 3 && e.lastMessageAt > e.trashedAt);
};

const unTrashChats = async (res, myId, chats) => {
  // console.log("trash");
  let chatIdList = [];

  const updatedChats = chats.map((e) => {
    if (e.status === 3 && e.lastMessageAt > e.trashedAt) {
      chatIdList.push(e._id);
      return { ...e, status: 0 };
    }
    return e;
  });

  await User.findOneAndUpdate(
    { _id: myId },
    {
      $set: { "chats.$[elem].status": 0 },
    },
    { arrayFilters: [{ "elem.chat": { $in: chatIdList } }] }
  );

  res.json({ chats: updatedChats });
};

module.exports.createChat = async (req, res) => {
  const { userId, isPrivate } = req.body;
  const myId = req.user._id;

  // Check if chat already exists
  const chatIsAlreadyMade = await Chat.find({
    users: { $all: [myId, userId] },
    isPrivate: true,
  });

  if (chatIsAlreadyMade.length > 0)
    return res.json({ chatId: chatIsAlreadyMade[0]._id });

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
      $addToSet: {
        chats: [
          {
            chat: chat._id,
            status: 0,
          },
        ],
      },
    }
  );

  res.json({ chatId: chat._id });
};

module.exports.showChat = async (req, res) => {
  const user = req.user;
  const myId = req.user._id;
  const { id } = req.params;

  const chat = await Chat.findById(id).populate(
    "users",
    "-email -__v -chats -friends"
  );

  const friends = chat.users.filter((e) => {
    return e._id.toString() !== myId.toString();
  });

  const trashedAt = user.chats.find((e) => e.chat.toString() === id).trashedAt;

  const messages = await getMessages(id, trashedAt);

  // Add avatar to messages
  const parseMsgs = JSON.parse(JSON.stringify(messages)).reverse();

  const msgs = handleSpreadMessages(parseMsgs);

  let lastId;
  let idArr = [];
  for (let i = 0; i < msgs.length; i++) {
    // console.log(msgs[i].text);
    if (msgs[i].author._id === lastId) {
      const startDate = new Date(msgs[i].createdAt).getTime();
      const endDate = new Date(msgs[i - 1].createdAt).getTime();

      if ((endDate - startDate) / 1000 > 60) {
        idArr.push(msgs[i]._id);
      }
    } else {
      idArr.push(msgs[i]._id);
    }

    lastId = msgs[i].author._id;
  }

  const newMsgs = msgs.map((obj) => {
    if (idArr.includes(obj._id)) {
      return { ...obj, showAvatar: true };
    } else {
      return { ...obj, showAvatar: false };
    }
  });

  res.json({ friends, messages: newMsgs.reverse(), chat });
};

const handleSpreadMessages = (messages) => {
  let newArray = [];
  for (let { files, author, createdAt, text, ...rest } of messages) {
    if (text) newArray.push({ author, createdAt, text, ...rest });

    for (let file of files) {
      newArray.push({
        author,
        createdAt,
        file,
        _id: uuidv4(),
      });
    }
  }
  return newArray;
};

module.exports.enableChat = async (req, res) => {
  const { chatId } = req.body;

  await Chat.findOneAndUpdate(
    { _id: chatId },
    {
      $set: { isVisible: true },
    }
  );

  res.send("ok");
};

module.exports.createGroup = async (req, res) => {
  const myId = req.user._id;
  const { name } = req.body;

  const users = req.body.users.split(",");

  let path = null;
  let filename = null;
  let resize = {};
  if (req.file) {
    resize = JSON.parse(req.body.resize);
    path = req.file.path.replace(
      "/upload",
      `/upload/ar_1,c_crop,w_${resize.ZOOM},x_${resize.FindX},y_${resize.FindY}/w_200`
    );
    filename = req.file.filename;
  }

  const chat = await new Chat({
    name,
    image: {
      path,
      filename,
    },
    author: myId,
    users: [myId, ...users],
    isPrivate: false,
    isVisible: true,
  });
  await chat.save();

  // Add chat to users
  await User.updateMany(
    { _id: { $in: [myId, ...users] } },
    {
      $addToSet: {
        chats: [
          {
            chat: chat._id,
            status: 0,
          },
        ],
      },
    }
  );

  res.json({ chatId: chat._id });
};

module.exports.editChatStatus = async (req, res) => {
  const { chats, status } = req.body;
  const myId = req.user._id;

  const chatIdList = chats.map((e) => e._id);

  if (status === 3) {
    await User.findOneAndUpdate(
      { _id: myId },
      {
        $set: {
          "chats.$[elem].status": status,
          "chats.$[elem].trashedAt": new Date(),
        },
      },
      { arrayFilters: [{ "elem.chat": { $in: chatIdList } }] }
    );
  } else {
    await User.findOneAndUpdate(
      { _id: myId },
      {
        $set: { "chats.$[elem].status": status },
      },
      { arrayFilters: [{ "elem.chat": { $in: chatIdList } }] }
    );
  }

  res.json({ chats, status });
};
