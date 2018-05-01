const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;



const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    nick_name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: (v) => {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: `email is not a valid !`
        },
        required: [true, 'User email required']
    },
    pwd: String,
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            unique: true 
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            unique: true
        }
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
