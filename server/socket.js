const { sendMessage } = require("./controllers/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));

    socket.on("join", (roomId) => {
      console.log(`Socket ${socket.id} joining ${roomId}`);
      socket.join(roomId);
    });
    socket.on("leave", (roomId) => {
      console.log(`Socket ${socket.id} leaving ${roomId}`);
      socket.leave(roomId);
    });
    socket.on("message", (message) => {
      emitMessage(message, socket.request);
    });
  });

  const emitMessage = async (message, req) => {
    const messageDoc = await sendMessage(message, req.user);
    io.to(message.chatId).emit("message", messageDoc);
  };
};
