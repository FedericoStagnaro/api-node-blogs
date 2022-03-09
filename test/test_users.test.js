const app = require('../app')

const supertest = require('supertest')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./helper_user_test')

jest.setTimeout(6000)
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const users = helper.INITIAL_USER
    const userObject = users.map(user => new User(user))
    const userPromises = userObject.map(user => user.save())

    await Promise.all(userPromises)
})

describe('POST user', () => {
    test('valid user', async () => {
        const newUser = {
            username: 'ELANDRES',
            name: 'Andres',
            password: 'topSecret0123...'
        }

        const response = await api
            .post('/api/users/')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /json/)

        expect(response.body.username).toBe(newUser.username)
    })

    test('username taken', async () => {
        const newUser = {
            username: helper.INITIAL_USER[0].username,
            name: 'Andres',
            password: 'topSecret0123...'
        }

        const response = await api
            .post('/api/users/')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /json/)

        const usersAfter = await User.find({})

        expect(response.body).toEqual({ error: 'The expected username to be unique.' })
        expect(usersAfter).toHaveLength(helper.INITIAL_USER.length)
    })

    test('invalid username', async () => {
        const newUser = {
            username: 'as.',
            name: 'Andres',
            password: 'topSecret0123...'
        }

        const response = await api
            .post('/api/users/')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /json/)

        const usersAfter = await User.find({})

        expect(response.body).toEqual({ error: 'Username format invalid' })
        expect(usersAfter).toHaveLength(helper.INITIAL_USER.length)
    })

    test('invalid name', async () => {
        const newUser = {
            username: 'ELANDRES',
            name: 'Andres&123$...',
            password: 'topSecret0123...'
        }

        const response = await api
            .post('/api/users/')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /json/)

        const usersAfter = await User.find({})

        expect(response.body).toEqual({ error: 'Name format invalid' })
        expect(usersAfter).toHaveLength(helper.INITIAL_USER.length)
    })
    test('invalid password', async () => {})
})

describe('GET user', () => {
    test('all user', async () => {
        const response = await api
            .get('/api/users')
            .expect('Content-Type', /json/)

        const usernamesFromResponse = response.body.map(user => user.username)

        expect(usernamesFromResponse).toContain(helper.INITIAL_USER[0].username)
    })
    test('', async () => {})
    test('', async () => {})
    test('', async () => {})
})

afterAll(async () => {
    mongoose.connection.close()
})
