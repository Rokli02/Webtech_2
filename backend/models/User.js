const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        enum: ['male', 'female'],
        default: 'female'
    }
});

module.exports = mongoose.model('users', user);