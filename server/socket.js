const { sendMessage } = require("./controllers/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    console.log(socket.request.user);

    socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));

    socket.on("join", (roomId) => {
      console.log(`Socket ${socket.id} joining ${roomId}`);
      socket.join(roomId);
    });
    socket.on("leave", (roomId) => {
      console.log(`Socket ${socket.id} leaving ${roomId}`);
      socket.leave(roomId);
    });
    socket.on("message", ({ message, chatId, myId }) => {
      console.log(`msg: ${message}, room: ${chatId}`);
      emitMessage(message, chatId, myId);
    });
  });

  const emitMessage = async (message, chatId, myId) => {
    const messageDoc = await sendMessage(message, chatId, myId);
    io.to(chatId).emit("message", messageDoc);
  };

  // module.exports.emitMessage = (message, roomId) => {
  //   console.log(message);
  //   io.to(roomId).emit("message", message);
  // };
};

// io.on("connection", (socket) => {
//   console.log(`Connected: ${socket.id}`);

//   console.log("###################");
//   console.log(socket.request.user.name);
//   console.log("###################");
// });
