const Note = require('../model/noteschema')
const err = require('../util/error')

exports.create_note = async (req, res, next) => {
    const title = req.body.title
    const description = req.body.description

    try {
        const existingnote = await Note.findOne({title : title})
        if(existingnote){
            err.newerror('Note with specified title already exist', 409)
        }

        const createdNote = new Note({
            title,
            description
        })
        await createdNote.save()
        res.status(201).json({
            message : "New note successfully created",
            createnote : createdNote
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.getall_notes = async (req, res, next) => {
    try {
        const extractednotes = await Note.find()
        if(extractednotes.length == 0){
            res.status(200).json({
                message : "No notes currently available"
            })
        }
        else {
            res.status(200).json({
                message : "Notes successfully fetched",
                numberofNotes : extractednotes.length,
                notes : extractednotes
            })
        }
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.getsingle_note = async (req, res, next) => {
    try {
        const extractednote = await Note.findById(req.params.id)
        if(extractednote == null){
            res.status(200).json({
                message : "Note not found"
            })
        }
        else {
            res.status(200).json({
                message : "Note successfully fetched",
                note : extractednote
            })
        }
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.update_note = async (req, res, next ) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, { $set : { title : req.body.title, description : req.body.description}})
        res.status(200).json({
            message : "Note successfully updated"
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}


exports.delete_note = async (req, res, next) => {
    try {
        await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message : "Note successfully deleted"
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}