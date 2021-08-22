const mongoose = require('mongoose');

const User = mongoose.model('User',
    new mongoose.Schema({
        username: {
            type: String,
            required: true    
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    { collection: 'users' })
);

module.exports = User;