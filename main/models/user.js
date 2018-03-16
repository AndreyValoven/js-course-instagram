const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;



const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    nick_name: String,
    email: String,
    pwd: String,
    followers: [
        mongoose.Schema.Types.ObjectId
    ],
    following: [
        mongoose.Schema.Types.ObjectId
    ],
    avatar: String,
});

User.pre('save', function(next) {
    let user = this;

    if (!user.isModified('pwd')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
        if (error) return next(error);

        user.pwd = bcrypt.hashSync(user.pwd, salt);
        next();
    });
});

User.methods.comparePwd = function(pwd, cd) {
    bcrypt.compare(pwd, this.pwd, function(err, isMatch) {
        if (err) return cd(err);
        cd(null, isMatch);
    });
};

module.exports = mongoose.model('User', User);
