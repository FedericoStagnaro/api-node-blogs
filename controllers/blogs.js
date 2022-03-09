const router = require('express').Router()
const Blog = require('../models/blog')

const messageNotFound = {
    name: 'Not Found',
    message: 'Route not finded'
}
const messageContentMissing = {
    name: 'Content Missing',
    message: 'Missing post data'
}

router.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 })
        blogs
            ? response.json(blogs)
            : next(messageNotFound)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (request, response, next) => {
    const blog = request.body

    if (!blog.title && !blog.url) { return next(messageContentMissing) }

    const newBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: request.body.likes || 0
    }
    try {
        const blogObject = new Blog(newBlog)
        const blogReturned = await blogObject.save()
        response.status(201).json(blogReturned)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (request, response, next) => {
    const { id } = request.params
    const blog = request.body

    if (!blog.likes) { return next(messageContentMissing) }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { likes: blog.likes }, { returnDocument: 'after' })
        updatedBlog
            ? response.status(200).json(updatedBlog)
            : next(messageNotFound)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (request, response, next) => {
    const { id } = request.params

    try {
        const responseFromDb = await Blog.findByIdAndDelete(id)
        responseFromDb
            ? response.status(204).end()
            : next(messageNotFound)
    } catch (error) {
        next(error)
    }
})

module.exports = router
