const express = require("express");
const router = express.Router();
const chats = require("../controllers/chats");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/").get(chats.showChats);
router.route("/new").post(chats.createChat);
router.route("/:id").get(chats.showChat);
router.route("/enable").post(chats.enableChat);
router.route("/avatar").post(upload.single("avatar"), chats.newAvatar);

module.exports = router;
