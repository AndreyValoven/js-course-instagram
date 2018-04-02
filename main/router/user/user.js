const user = require('express').Router();
const varyfiToken = require('./../../functions/verify_token');


const checkValues = require('./../../functions/check_values');
const User = require('./../../models/user');

user.use('/:id/following', require('./following'));


user.use('/:id/followers', (req, res) => {
    let url = req.originalUrl.split('/');
    const id = url[3];
    User.findById(id, (error, user) => {
        User.find( {
            _id: {
                $in: user.followers
            }
        }, (error, users) => {
            if (error) return res.status(500).json({ error });
            users = users.map(item => {
                return {
                    id: item._id,
                    nick_name: item.nick_name,
                    avatar: item.avatar
                };
            });
            res.json(users);
        });
    });
});

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


user.delete('/:id', varyfiToken,
    (req, res) => {
        console.log(req.id + '',req.params.id+ '');
        if (req.id + '' !== req.params.id+ '') {
            return res.status(403).json({ erorr: 'Forbidden'});
        }
        User.findByIdAndRemove(req.id ,(error, user) => {
            if(error)
                return res.json({ error });
            res.json({
                user
            });
        });
    });

user.patch('/:id', varyfiToken,
    (req, res, next) => {
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
        next();
    },
    (req,res) => {
        const body = req.body;
        const id = req.params.id;
        body.pwd = bcrypt.hashSync(body.pwd, process.env.SALT_WORK_FACTOR);
        // check if exists uaser
        User.findByIdAndUpdate( id,
            {
                $set: {
                    pwd: body.pwd
                }
            },
            { new: true },

            function(error, user) {
                if (error) {
                    return res.status(501).json({
                        error
                    });
                }
                console.log(user);
                res.status(202).json({
                    user,
                });
            });
    });

module.exports = user;
