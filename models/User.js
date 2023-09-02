const mongoose = require('mongoose')

// define schema for User entity
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // array allows more than one role to be assigned
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

// export schema as User
module.exports = mongoose.model('User', userSchema)