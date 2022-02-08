const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
const mongoUrl = require('./utils/config').DATABASE_URL
const Blog = require('./models/blog')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

mongoose
  .connect(mongoUrl)
  .then(() => logger.info('database conected'))

// ======================= MIDDLEWARES ================

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// ======================= END POINTS =================

app.use('/api/blogs', blogsRouter) // controllers

app.use(middleware.unknowEndpoint)
app.use(middleware.errorHandler)

module.exports = app
