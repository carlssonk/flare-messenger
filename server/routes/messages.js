const express = require("express");
const router = express.Router();
const messages = require("../controllers/messages");

router.route("/").post(messages.sendMessage);

module.exports = router;
