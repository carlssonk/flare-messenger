const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const friends = require("../controllers/friends");
const { userSchema } = require("../schemas");
const { checkSchema } = require("express-validator");
const { validateUser, checkAvailability } = require("../middleware");

// USER
router.route("/user").get(users.user);

router.route("/user/available").get(catchAsync(users.checkAvailability));

router
  .route("/register")
  .post(
    checkSchema(userSchema),
    validateUser,
    catchAsync(checkAvailability),
    catchAsync(users.register)
  );

router.route("/login").post(users.login);

router.route("/logout").post(users.logout);

// FRIENDS
router.route("/friends").get(friends.searchUsers);
router.route("/friends/request").post(friends.sendFriendRequest);
router.route("/friends/incoming").get(friends.incomingRequests);

module.exports = router;
