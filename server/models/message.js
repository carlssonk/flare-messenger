const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    text: String,
    stringTag: String,
    hasUrl: Boolean,
    files: {
      type: Array,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
