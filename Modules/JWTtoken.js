const dotenv = require("dotenv")
dotenv.config()
const jwt=require('jsonwebtoken')



const generatToken = ({ email,user_id }) => {
    const token = jwt.sign({ email: email,user_id:user_id }, process.env.JWT_SECRET, {
        algorithm:process.env.JWT_ALGORITHM
    })
    return token
}
const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM })
    return decoded
}

module.exports = {
    generatToken,
    verifyToken
}