const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

// define schema for Note entity
const noteSchema = new mongoose.Schema(
    {
    user: {
        // object id from a schema
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // the schema being referred to
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
    },
    // separate option object for timestamps
    {
        timestamps: true
    }
)

// ticket number counter
noteSchema.plugin(AutoIncrement, {
    // set options
    inc_field: 'ticket',  // name of increment field
    id: 'ticketNums', // separate collection named counter will contain this id
    start_seq: 500 // start counter at 500
})

// export schema as Note
module.exports = mongoose.model('Note', noteSchema)