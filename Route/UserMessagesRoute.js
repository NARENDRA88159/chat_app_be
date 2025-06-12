const express = require("express")
const { createMessage, getAllMessages, deleteMessage, updateMessage } = require("../Controler/UserMessages")
const router = express.Router()

router.post("/createMessage", createMessage)
router.post("/getAllMessages", getAllMessages)
router.patch("/updateMessages", updateMessage)
router.delete("/deleteMessages", deleteMessage)
// router.post("/audio",)


module.exports=router
