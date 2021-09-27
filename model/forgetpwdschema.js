const mongoose = require('mongoose')

const forgetpwdSchema = new mongoose.Schema({
    email : {
        required: true,
        type : String
    },
    token : {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Forgetpwd', forgetpwdSchema)