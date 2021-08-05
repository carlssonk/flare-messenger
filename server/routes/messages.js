const express = require("express");
const router = express.Router();
const messages = require("../controllers/messages");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/:id").post(upload.array("files", 10), messages.sendMessage);

module.exports = router;
