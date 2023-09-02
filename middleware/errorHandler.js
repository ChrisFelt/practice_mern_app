// import logEvents helper function
const { logEvents } = require('./logger')

// override default express error handling
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t
    ${req.headers.origin}`, 'errLog.log')
    console.log(err.stack) // prints several lines of detailed error message

    // check res for status code set, set if no status code
    const status = res.statusCode ? res.statusCode : 500
    res.status(status)

    res.json({ message: err.message })
}

module.exports = errorHandler