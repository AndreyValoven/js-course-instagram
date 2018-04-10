const user = require('express').Router();
const varyfiToken = require('./../../functions/verify_token');

// const checkValues = require('./../functions/check_values');
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
                        name: user.name,
                        nick_name: user.nick_name,
                        email: user.email,
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


user.patch('/:id', varyfiToken,
    (req, res) => {
        const body = req.body;
        const id = req.params.id;
        if (req.id + '' !== id+ '') {
            return res.status(403).json({ erorr: 'Forbidden'});
        }

        if (typeof req.id !== 'object') {
            return res.status(503).json({
                error: 'not exist'
            });
        }

        if (checkValues(body)) {
            return res.status(400).json({
                error: 'empty values or not corect email'
            });
        }
        // check if exists uaser
        User.findById( id,
            function(error, user) {
                if (error) {
                    return res.status(501).json({
                        error
                    });
                }
                user.name = body.name;
                user.nick_name = body.nick_name;
                user.email = body.email;
                user.pwd = body.pwd;
                user.save()
                    .then(user => {
                        console.log(user);
                        res.status(202).json({
                            user,
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({
                            error
                        });
                    });
            });
    });

module.exports = user;
