const Image = require('./../models/image');
const mongoose = require('mongoose');

module.exports = function(body) {
    let image = new Image({
        _id: mongoose.Types.ObjectId(),
        user_id: body.userId,
        url: body.url,
        file_name: body.file_name,
        date: Date.now(),
        likes: [],
        tags: []
    });
    return image.save();
};
