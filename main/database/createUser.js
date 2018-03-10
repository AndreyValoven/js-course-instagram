const User = require('./../models/user');
const mongoose = require('mongoose');


module.exports = function(body) {
    let user = new User({
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        nick_name: body.nick_name,
        email: body.email,
        pwd: body.pwd,
        followers: [],
        following: [],
        avatar: ''
    });

    return user.save();
};
