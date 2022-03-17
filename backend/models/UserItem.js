const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userItem = new Schema({
    uid: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('userItems', userItem);