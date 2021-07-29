const express = require("express");
const router = express.Router();
const chats = require("../controllers/chats");

router.route("/").get(chats.showChats);
router.route("/new").post(chats.createChat);
router.route("/:id").get(chats.showChat);
router.route("/enable").post(chats.enableChat);

module.exports = router;
