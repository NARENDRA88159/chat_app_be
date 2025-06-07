const express = require("express")
const { signUp } = require("../Controler/UserControler")
const router = express.Router()

router.post("signUp", signUp)
router.post("login", login)
