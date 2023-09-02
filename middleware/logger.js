// destructure objects to access properties
const { format } = require('date-fns')
// rename v4 to uuid
const { v4: uuid } = require('uuid')

// get fs module
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

// helper function to log events
const logEvents = async (message, logFileName) => {
    // todo: dateTime does not to be a template litera
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    // uuid creates a specific id for each log item
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    // logs EVERY request to the server and will get full very fast
    // add conditionals such as only log if req does not come from our url
    // or limit to specific request methods
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next() // move on to next piece of middleware or controller
}

module.exports = { logEvents, logger }