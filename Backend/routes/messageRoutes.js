const express = require("express")
const router = express.Router()

const { sendMessage, getMessages, sendFile } = require("../controllers/messageController")
const upload = require("../middleware/upload")

router.post("/send", sendMessage)


router.post("/send-file", upload.single("file"), sendFile)

router.get("/:senderId/:receiverId", getMessages)

module.exports = router