const express = require('express')
const router = express.Router()
const path = require('path')

// regex refresher: 
// ^: beginning of string; $: end of string; |: OR; (): group; ?: optional
router.get('^/$|/index(.html)?', (req, res) => {
    // look for file in ../views/index.html
    res.sendFile(path.join(__dirname,  '..', 'views', 'index.html'))
})

module.exports = router