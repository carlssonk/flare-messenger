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
    socket.on("message", (message) => {
      // console.log(`msg: ${message}, room: ${chatId}`);
      console.log("MESSAGE BRO");
      emitMessage(message, socket.request);
    });
  });

  const emitMessage = async (message, req) => {
    const messageDoc = await sendMessage(message, req.user);
    io.to(message.chatId).emit("message", messageDoc);
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
