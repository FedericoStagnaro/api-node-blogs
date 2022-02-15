require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URL
  : process.env.TEST_DATABASE_URI

module.exports = { MONGODB_URI, PORT }
