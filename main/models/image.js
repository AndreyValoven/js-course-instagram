let mongoose = require('mongoose');

const image = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    url: String,
    data: String,
    likes: mongoose.Schema.Types.Array,
});

module.exports = mongoose.model('Image', image);
