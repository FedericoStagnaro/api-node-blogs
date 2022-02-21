const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
const mongoUrl = require('./utils/config').MONGODB_URI

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

mongoose
    .connect(mongoUrl)
    .then(() => logger.info('database conected'))

// ======================= MIDDLEWARES ================

app.use(cors())
app.use(express.json())
// app.use(middleware.requestLogger)

// ======================= END POINTS =================

app.use('/api/blogs', blogsRouter) // controllers

app.use(middleware.errorHandler)
app.use(middleware.unknowEndpoint)

module.exports = app
