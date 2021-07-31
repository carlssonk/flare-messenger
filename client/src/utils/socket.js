import io from "socket.io-client";
// import { createContext } from "react";
// import { SocketContext } from "./context/SocketContext";

const socket = io("http://localhost:3000");

// export const initiateSocket = () => {
//   socket = io("http://localhost:3000");
//   // export socket = io.connect("http://localhost:3000");
//   console.log(`Connecting socket...`);
//   // console.log(socket);
// };
export const joinChat = (chatId) => {
  if (socket && chatId) socket.emit("join", chatId);
};
export const leaveChat = (chatId) => {
  if (socket && chatId) socket.emit("leave", chatId);
};
export const sendMessage = (message) => {
  if (socket && message.chatId) socket.emit("message", message);
};

// export const recieveMessage = (data) => {
//   socket.on("message", () => {
//     console.log(data);
//   });
//   return data;
// };

export default socket;

// export const SocketContext = createContext({});
// socket = io("http://localhost:3000");

// export const socket = io("http://localhost:3000");

// export const disconnectSocket = () => {
//   console.log("Disconnecting socket...");
//   if (socket) socket.disconnect();
// };
// export const subscribeToChat = (cb) => {
//   if (!socket) return true;
//   socket.on("chat", (msg) => {
//     console.log("Websocket event received!");
//     return cb(null, msg);
//   });
// };
