export const joinChat = (socket, chatId) => {
  if (socket && chatId) socket.emit("join", chatId);
};
export const leaveChat = (socket, chatId) => {
  if (socket && chatId) socket.emit("leave", chatId);
};
export const sendMessage = (socket, message) => {
  console.log("utils!");
  if (socket && message.chatId) socket.emit("message", message);
};
