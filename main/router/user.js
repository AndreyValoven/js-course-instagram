const user = require('express').Router();
const varyfiToken = require('./../functions/verify_token');
// const jwt = require('jsonwebtoken');

const User = require('./../models/user');
// const varyfiToken = require('./../functions/verufi_token');

user.get('/:id', varyfiToken,(req, res) => {
    // check if exists user in db
    const id = req.params.id;
    User.findOne({ _id: id })
        .then(user => {
            if ( user != null ) {
                if (typeof req.id === 'object' && req.id !== user._id ) {
                    let followerUser = false;
                    for (const tokenId of user.followers) {
                        tokenId.toString() === req.id.toString() ? followerUser = true : followerUser;
                    }
                    res.status(200).json({
                        find: 'find',
                        name: user.name,
                        nick_name: user.nick_name,
                        avatar: user.avatar,
                        followers: user.followers.length,
                        following: user.following.length,
                        followUser: followerUser
                    });
                } else {
                    res.status(200).json({
                        name: user.name,
                        nick_name: user.nick_name,
                        avatar: user.avatar,
                        followers: user.followers.length,
                        following: user.following.length,
                    });
                }
            } else {
                res.status(404).json({
                    error: 'not found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = user;
