const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

// router methods
router.route('/')
    .get(usersController.getAllUsers) // read
    .post(usersController.createNewUser) // create
    .patch(usersController.updateUser) // update
    .delete(usersController.deleteUser)

module.exports = router