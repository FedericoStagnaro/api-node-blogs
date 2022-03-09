const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
const MONGO_URL = require('./utils/config').MONGODB_URI
const PORT = require('./utils/config').PORT

const logger = require('./utils/logger')

const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

// ==================== DATABASE ====================

logger.info('Connecting to port: ', PORT)
logger.info('Connecting to port: ', PORT)

mongoose
    .connect(MONGO_URL)
    .then(() => console.log('database conected'))
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

// ======================= MIDDLEWARES ================

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// ======================= END POINTS =================

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter) // controllers

app.use(middleware.errorHandler)
app.use(middleware.unknowEndpoint)

module.exports = app
