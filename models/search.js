const mongoose = require('mongoose');

let Search = mongoose.model('Search', {
    createdAt: {
        type: Number,
        required: true
    },
    term: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    when: {
        type: String,
        required: true
    }
});

module.exports = {Search};