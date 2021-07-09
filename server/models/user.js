const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// const hexCodes = [
//   "#38b6a1",
//   "#66c787",
//   "#5b3cb0",
//   "#896b04",
//   "#956365",
//   "#70c2b0",
//   "#566445",
//   "#ac1b34",
//   "#415752",
//   "#1b513a",
//   "#55a9ba",
//   "#bd6a26",
//   "#622216",
//   "#c5b11f",
//   "#63bb7c",
//   "#384618",
//   "#1429a4",
//   "#4928e3",
//   "#dfab0f",
// ];

// const randomHexGenerator = () => {
//   return hexCodes[Math.floor(Math.random() * hexCodes.length)];
// };

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    avatar: {
      path: String,
      filename: String,
      hexCode: String,
    },
    friends: {
      sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
      incomingRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
      friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
