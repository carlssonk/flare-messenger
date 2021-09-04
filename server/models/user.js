const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    lastActive: {
      type: Date,
      required: true,
    },
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
    chats: [
      {
        _id: false,
        chat: {
          type: Schema.Types.ObjectId,
          ref: "Chat",
        },
        status: {
          type: Number,
          required: true,
        },
        // Status:
        //  0 = Default,
        //  1 = Pinned,
        //  2 = Archived,
        //  3 = Trashed
        trashedAt: Date,
        color: {
          name: String,
          colors: String,
        },
      },
    ],
  },
  { timestamps: true }
);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
