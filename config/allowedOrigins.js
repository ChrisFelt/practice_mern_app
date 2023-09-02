// specify origins that are allowed to access the API
// allows us to make cors secure
const allowedOrigins = [
    'http://localhost:3000',
    // the following are fictitious websites
    'https://www.dandrepairshop.com', // the stakeholder's website
    'https://dandrepairshop.com' // match previous without www
]

module.exports = allowedOrigins