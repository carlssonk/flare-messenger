const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;

const friendSchema = new Schema(
  {
    // Exempel: Bob vill bli vänn med Olof
    sentRequests: { type: Schema.Types.ObjectId, ref: "User" },
    incomingRequests: { type: Schema.Types.ObjectId, ref: "User" },
    friends: { type: Schema.Types.ObjectId, ref: "User" },
    // requester: { type: Schema.Types.ObjectId, ref: "User" }, // Förfrågare ex. Bob
    // recipient: { type: Schema.Types.ObjectId, ref: "User" }, // Mottagare ex. Olof
    // status: {
    //   type: Number,
    //   enums: [
    //     0, // "sent requests"
    //     1, // "incoming requests"
    //     2, // "friends"
    //   ],
    // },
  }
  // { timestamps: true }
);

// Middleware for deleting friends references when document gets deleted
// friendSchema.post("deleteMany", async function (doc) {
//   if (doc) {
//     await User.deleteMany({
//       _id: {
//         $in: doc.friends,
//         $set: { friends: [] },
//       },
//     });
//   }
// });

module.exports = mongoose.model("Friend", friendSchema);
