const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    name: {
      type: String,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
