const express = require("express")
const { createMessage, getAllMessages } = require("../Controler/UserMessages")
const router = express.Router()

router.post("/createMessage", createMessage)
router.post("/getAllMessages", getAllMessages)

module.exports=router
