const { sendMessage } = require("./controllers/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    // console.log(socket.request.user);

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
      console.log("all good, got the message");
      emitMessage(message, socket.request);
    });
  });

  const emitMessage = async (message, req) => {
    console.log("socket " + message.text);
    const messageDoc = await sendMessage(message, req.user);
    console.log(message.chatId);
    io.to(message.chatId).emit("message", messageDoc);
  };
};
