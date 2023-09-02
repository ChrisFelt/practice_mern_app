const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    // lookup object for the cors third-party middleware
    origin: (origin, callback) => {
        // limit origins to urls in the allowedOrigins array
        // OR postman and other tools via !origin
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // callback returns: error object, allowed? boolean 
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true, // auto-handle credentials
    optionsSuccessStatus: 200 // default is 204, but 200 is safer for some devices
}

module.exports = corsOptions