const mongoose = require('mongoose')
const val = require('../utils/validator')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        validate: [{
            validator: val.valUsername,
            message: 'Username format invalid',
            name: 'UsernameInvalid'
        }]
    },
    name: {
        type: String,
        required: true,
        validate: [{
            validator: val.valName,
            message: 'Name format invalid',
            name: 'NameInvalid'
        }]
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.plugin(
    uniqueValidator,
    { message: 'The expected {PATH} to be unique.' },
    { name: 'UniqueValidation' })

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
