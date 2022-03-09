const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const val = require('../utils/validator')

userRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs', { userId: 0, id: 0 })
        response.status(200).json(users)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/', async (request, response, next) => {
    const body = request.body

    // const oldUser = await User.findOne({ username: body.username })

    // if (!oldUser) { return response.status(400).json({ error: 'username taken' }) }
    if (!val.valPasswordStrong(body.password)) { return response.status(400).json({ error: 'The password is not strong enough' }) }

    const passwordHash = await bcrypt.hash(body.password, 10)

    try {
        const newUser = new User({
            username: body.username,
            name: body.name,
            passwordHash: passwordHash
        })

        const userSaved = await newUser.save()
        response.status(201).json(userSaved)
    } catch (error) {
        next(error)
    }
})

module.exports = userRouter
