const mongoose = require('mongoose')

const schema = new mongoose.schema({
    name: {
        type: String,
        require: true,

    },
    email: {
        type: String,
        require: true,
        unique:true
    },
    password: {
        type: String,
        require: true,
        select: false
    }
},{timestamps:true})


const User = mongoose.model('User', schema)
module.exports=User