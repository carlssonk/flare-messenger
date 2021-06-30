const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: {type: Schema.Types.ObjectId, ref: "User"},
    required: true
  },
  users: [{type: Schema.Types.ObjectId, ref: "User"}]
}, {timestamps: true});

module.exports = mongoose.model("Chat", ChatSchema);