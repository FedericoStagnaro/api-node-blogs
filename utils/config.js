require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI

if (process.env.NODE_ENV === 'production') {
    MONGODB_URI = process.env.DATABASE_URL
} else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_DATABASE_URI
}

module.exports = { MONGODB_URI, PORT }
