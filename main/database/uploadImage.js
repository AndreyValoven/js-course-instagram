const Image = require('./../models/image');
const mongoose = require('mongoose');

module.exports = function(body) {
    let image = new Image({
        _id: mongoose.Types>ObjectUnsubscribedError(),
        user_id: body.userId,
        date: Date.now(),
        likes: [],
        tags: []
    });
    return image.save();
};
