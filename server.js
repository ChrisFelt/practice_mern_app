require('dotenv').config() // allows use of env variables throughout app
const express = require('express')
const app = express()
const path = require('path')
// import logger middleware
const { logger, logEvents } = require('./middleware/logger')
// import error handler middleware
const errorHandler = require('./middleware/errorHandler')
// import cookie parsing
const cookieParser = require('cookie-parser')
// enable Corss-Origin Resource Sharing (CORS)
// makes the API available to the public
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
// mongoose DB connection
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
// get PORT in env variables if exists, or default to 3500
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV) // log NODE_ENV value

connectDB()

app.use(logger)

// use cors with urls restricted to allowed origins
app.use(cors(corsOptions))

// built-in middleware to receive and parse json data
app.use(express.json())

app.use(cookieParser())

// tell express where to find static files
// __dirname references current folder
// subdirectory may include or disclude '/' preface
// "app.use(express.static('public'))" accomplishes the same thing
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/users', require('./routes/noteRoutes'))

// catch-all route for errors
app.all('*', (req, res) => {
    res.status(404)
    // check what the client can accept and send response accordingly
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found'})
    } else {
        // text is usually accepted, so send text as catch all
        res.type('txt').send('404 Not found')
    }
})

app.use(errorHandler)

// listen for open event
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    // log mongoDB errors to mongoErrLog.log
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
