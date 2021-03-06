let mongoose = require('mongoose');

const image = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    url: {
        type: String,
        unique: true
    },
    file_name: {
        type: String,
        unique: true
    },
    date: String,
    likes: [
        mongoose.Schema.Types.ObjectId,
    ],
    tags: [
        String
    ]
});

module.exports = mongoose.model('Image', image);
