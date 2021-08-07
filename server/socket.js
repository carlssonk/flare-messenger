// const { sendMessage } = require("./controllers/messages");

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
    module.exports.emitMessage = (chatId, message) => {
      io.to(chatId).emit("message", message);
    };
  });
};
