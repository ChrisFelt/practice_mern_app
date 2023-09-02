const User = require('../models/User')
const Note = require('../models/Note')
// asyncHandler helps to avoid plethora of try-catch blocks
const asyncHandler = require('express-async-handler')
// bcrypt used to hash password before we save it
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
// no NEXT because this controller is the end of the line (processing final data and sending response)
const getAllUsers = asyncHandler(async (req, res) => {
    // query db for all users
    // do not send password back to client
    // lean stops mongoose from sending full document with methods (good for GET)
    const users = await User.find().select('-password').lean()
    // optional chaining checks that users exists before checking length
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // verify data
    // !"0": when paired with a boolean, the string "0" resolves to false in JS
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate username
    // findOne attempts to match the query to an existing entry in the db
    // exec recommended on queries where value is passed and promise expected
    const duplicate = await User.findOne({ username }).lean().exec()

    // return conflict status (409) if username already exists
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // hash password
    // second value is "salt rounds" - increases time needed to calculate hash
    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPwd, roles }

    // create and store new user
    const user = await User.create(userObject)

    if (user) { 
        // successfully created user
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // verify data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // query db for user match by id
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()
    // allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // update the user entity
    // password update not required
    user.username = username
    user.roles = roles
    user.active = active

    // update password if requested
    if (password) {
        // hash pwd
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    // save updates to db 
    const updatedUser = await user.save() // errors caught by asyncHandler

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID required' })
    }

    // prevent delete operation if user has notes associated with it
    const note = await Note.findOne({ user: id }).lean().exec()

    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // query db for user by matching id
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // delete the user from the db
    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}