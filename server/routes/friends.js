const express = require("express");
const router = express.Router();
const friends = require("../controllers/friends");

router.route("/").get(friends.searchUsers);
router.route("/friendsandpending").get(friends.friendsAndPending);
router.route("/friends").get(friends.getFriends);
router.route("/request").post(friends.sendFriendRequest);
router.route("/handle").post(friends.handleRequest);

module.exports = router;
