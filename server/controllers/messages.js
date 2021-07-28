const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

module.exports.getMessages = async (chatId) => {
  const messages = await Message.find(
    { chat: chatId },
    "-chat -__v -updatedAt"
  ).populate(
    "author",
    "-__v -createdAt -updatedAt -friends -email -chats -name"
  );

  console.log(chatId);
  console.log("messages");
  console.log(messages);
  console.log("messages");

  return messages;
};

module.exports.sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const myId = req.user._id;

  const message = await new Message({ text, chat: chatId, author: myId });
  await message.save();

  res.json({ text });
};
