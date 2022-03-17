const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let item = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('items', item);
