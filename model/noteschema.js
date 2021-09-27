const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title : {
        required : true,
        type: String
    },
    description : {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Note', noteSchema)