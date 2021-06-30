const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  friends: {
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    incomingRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
},{timestamps: true});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
