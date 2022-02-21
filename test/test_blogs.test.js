const app = require('../app')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_blog_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
    const blogsObject = blogs.map(blog => new Blog(blog))
    const blogsPromises = await blogsObject.map(blog => blog.save())
    await Promise.all(blogsPromises)
})

describe('Get /api/blogs', () => {
    test('blogs as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /json/)
    })

    test('all notes', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('property id is defined', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('Post /api/blogs', () => {
    test('a correct blog', async () => {
        const newBlog = {
            title: 'something',
            author: 'someone',
            url: 'www.somewhere.com',
            likes: 13
        }

        const response = await api.post('/api/blogs').send(newBlog).expect(201)
        const blogsInDB = await helper.blogsInDB()

        expect(blogsInDB).toHaveLength(helper.initialBlogs.length + 1)
        expect(response.body.title).toContain(newBlog.title)
    })
    test('with likes undefined and return as 0', async () => {
        const newBlog = {
            title: 'something',
            author: 'someone',
            url: 'www.somewhere.com'
        }
        const response = await api.post('/api/blogs').send(newBlog).expect(201)
        expect(response.body.likes).toBeDefined()
        expect(response.body.likes).toBe(0)
    })
    test('content missing - title and url', async () => {
        const incompleteBlog = {
            author: 'someone',
            likes: 19
        }
        const blogsBefore = helper.initialBlogs.length
        const response = await api.post('/api/blogs').send(incompleteBlog).expect(400)
        expect(response.body).toBe('Missing post data')

        const blogsAfter = (await helper.blogsInDB()).length
        expect(blogsAfter).toBe(blogsBefore)
    })
})

describe('Delete /api/blogs', () => {
    test('correct request', async () => {
        const blogsBefore = await helper.blogsInDB()
        const blogForDelete = blogsBefore[0]

        await api.delete(`/api/blogs/${blogForDelete.id}`).expect(204)
        const blogsAfter = helper.blogsInDB()
        expect(blogsAfter).not.toContainEqual(blogForDelete)
    })
    test('id no exist', async () => {
        const blogsBefore = await helper.blogsInDB()
        const id = await helper.idBlogNonExistent()

        const response = await api.delete(`/api/blogs/${id}`).expect(404)
        const blogsAfter = await helper.blogsInDB()
        expect(response.body).toBe('Route not finded')
        expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
    test('id malformated', async () => {
        const blogsBefore = await helper.blogsInDB()
        const id = '1234'

        const response = await api.delete(`/api/blogs/${id}`).expect(400)
        const blogsAfter = await helper.blogsInDB()
        expect(response.body).toBe('Id malformated.')
        expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
})

describe('Put /api/blogs', () => {
    test('valid request and valid format', async () => {
        const blogsBefore = await helper.blogsInDB()
        const firstBlog = blogsBefore[0]

        const blogForUpdate = {
            ...firstBlog,
            likes: firstBlog.likes + 1
        }

        const response = await api.put(`/api/blogs/${blogForUpdate.id}`).send(blogForUpdate).expect(200)
        expect(response.body).toEqual(blogForUpdate)
    })
    test('valid id and invalid format', async () => {
        const blogsBefore = await helper.blogsInDB()
        const firstBlog = blogsBefore[0]

        const blogForUpdate = {
            title: firstBlog.title,
            author: firstBlog.author,
            url: firstBlog.url
            // likes => not defined
        }

        const response = await api.put(`/api/blogs/${blogForUpdate.id}`).send(blogForUpdate).expect(400)
        expect(response.body).toBe('Missing post data')
    })
    test('invalid id and valid format', async () => {
        const blogsBefore = await helper.blogsInDB()
        const firstBlog = blogsBefore[0]

        const blogForUpdate = {
            ...firstBlog,
            likes: firstBlog.likes + 1,
            id: '1234' // ID not valid
        }

        const response = await api.put(`/api/blogs/${blogForUpdate.id}`).send(blogForUpdate).expect(400)
        expect(response.body).toBe('Id malformated.')
    })
})

afterAll(() => {
    mongoose.connection.close()
})
