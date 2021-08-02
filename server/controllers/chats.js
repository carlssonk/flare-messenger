const Chat = require("../models/chat");
const User = require("../models/user");
const { getMessages, getLastMessages } = require("./messages");
const moment = require("moment");

module.exports.showChats = async (req, res) => {
  const myId = req.user._id;

  const user = await User.findById(
    myId,
    "-friends -__v -username -email -updatedAt -_id"
  ).populate({
    path: "chats",
    select: "-__v -createdAt -updatedAt -author",
    populate: {
      path: "users",
      model: "User",
      match: { _id: { $ne: myId } },
      select: "-_id -__v -friends -createdAt -updatedAt -email -chats",
    },
  });

  // Filter chats that are visible
  const chats = user.chats.filter((e) => e.isVisible);

  // Fetch last messages of each chat
  const chatsWithMessages = await getLastMessages(chats);

  const chatsWithMessagesFormatTime = chatsWithMessages.map((e) => ({
    ...e,
    createdAt: moment(e.createdAt).fromNow(true),
  }));

  res.json({ chats: chatsWithMessagesFormatTime });
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
      $addToSet: { chats: chat._id },
    }
  );

  res.json({ chatId: chat._id });
};

module.exports.showChat = async (req, res) => {
  const myId = req.user._id;
  const { id } = req.params;

  const chat = await Chat.findById(id).populate(
    "users",
    "-email -__v -chats -friends"
  );

  const friends = chat.users.filter((e) => {
    return e._id.toString() !== myId.toString();
  });

  const messages = await getMessages(id);

  res.json({ friends, messages, chat });
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
  // console.log(users);
  // console.log()

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
      $addToSet: { chats: chat._id },
    }
  );

  res.json({ chatId: chat._id });
};
