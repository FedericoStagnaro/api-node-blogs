const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Cohetes Orbitales',
        author: 'Space x',
        url: 'www.spacex.com',
        likes: 78
    },
    {
        title: 'Salidas Laborales',
        author: 'Un exitoso mas',
        url: 'www.tuTrabajo.com',
        likes: 26
    }
]

const idBlogNonExistent = async () => {
    const blog = {
        title: 'something',
        author: 'someone',
        url: 'www.somewhere.com'
    }
    const blogObject = new Blog(blog)
    const blogSaved = await blogObject.save()
    await Blog.findByIdAndDelete(blogSaved.id)
    return blogSaved.id
}

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB, idBlogNonExistent
}
