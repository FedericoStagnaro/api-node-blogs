const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)

test('blogs returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect('Content-Type', /json/)
    .expect(200)
})

afterAll(() => {
  mongoose.connection.close()
})
