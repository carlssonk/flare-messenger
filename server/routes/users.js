const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const { userSchema } = require("../schemas");
const { checkSchema } = require("express-validator");
const { validateUser, checkAvailability } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// USER
router.route("/user").get(users.user);

router.route("/user/available").get(catchAsync(users.checkAvailability));

router.route("/avatar").post(upload.single("avatar"), users.newAvatar);
// router.route("/avatar").post(users.newAvatar);

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

module.exports = router;
