const User = require('./../models/user');
// const mongoose = require('mongoose');

module.exports = function(id, item, callback = {}) {
    User.findById(id, (error, user) => {
        User.find( {
            _id: {
                $in: user[item]
            }
        })
            .then(users => {
                users = user.map(item => {
                    return {
                        id: item._id,
                        nick_name: item.nick_name,
                        avatar: item.avatar
                    };
                });
                callback(users);
            })
            .catch(error => console.log(error));
    });
};
