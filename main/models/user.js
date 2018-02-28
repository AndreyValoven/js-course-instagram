let mongoose = require('mongoose');


const user = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    nick_name: String,
    email: String,
    followers: Array,
    following: Array,
    avatar: String,
});

module.exports = mongoose.model('User', user);
