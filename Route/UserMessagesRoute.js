const express = require("express")
const { createMessage, getAllMessages, deleteMessage, updateMessage, audios, Images } = require("../Controler/UserMessages");
const multer = require("multer");
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require('fs');

router.post("/createMessage", createMessage)
router.post("/getAllMessages", getAllMessages)
router.patch("/updateMessages", updateMessage)
router.delete("/deleteMessages", deleteMessage)
router.post("/audio", upload.single('audio'), audios)
router.post("/images",upload.single('image'),Images)


module.exports=router
