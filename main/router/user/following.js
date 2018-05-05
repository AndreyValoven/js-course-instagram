const following = require('express').Router();

const User = require('./../../models/user');
const varyfiToken = require('./../../functions/verify_token');

following.get('/',varyfiToken ,(req, res) => {
    let url = req.originalUrl.split('/');
    const id = url[3];
    User.findById( id, (error, user) => {
        if( user === null ) return res.status(404).json({ erorr: 'not ezist'});
        console.log(user);
        User.find( {
            _id: {
                $in: user.following
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

// need to test
following.patch('/', varyfiToken,
    (req, res) => {
        let url = req.originalUrl.split('/');
        const id = url[3];
        if (typeof(req.id) === 'undefined' || req.id + '' === id+ '') {
            return res.status(403).json({ erorr: 'Forbidden'});
        }
        User.findById(id, (error, user) => {
            if(user === null) return res.status(404).json({ erorr: 'not ezist'});
            if (error) return res.status(500).json({ error });
            if (user.followers.includes(req.id)) return res.status(500).json({messge: 'you follow this user'});
            console.log(user.followers.includes(req.id));
            for(let uFollow of user.followers) {
                if (uFollow + '' === req.id + '')
                    return res.status(500).json({messge: 'you follow this user'});
            }
            user.followers.push(req.id);
            user.save()
                .then(user => {
                    console.log(user);
                    User.findById(req.id, (error, user) => {
                        if (error) return res.status(500).json({ error });
                        user.following.push(id);
                        user.save()
                            .then(user => {
                                console.log(user);
                                res.json({ status: 'ok' });
                            })
                            .catch(error => {
                                res.status(501).json({ error });
                            });
                    });
                })
                .catch(error => {
                    res.status(501).json({ error });
                });
        });
    }
);


following.delete('/', varyfiToken, (req, res) => {
    let url = req.originalUrl.split('/');
    const id = url[3];
    if (typeof(req.id) === 'undefined' || req.id + '' === id+ '') {
        return res.status(403).json({ erorr: 'Forbidden'});
    }
    Promise.all([deleteFollow(id+'', req.id+'', 'followers'), deleteFollow(req.id+'', id+'', 'following')])    
        .then(users => {
            console.log(users);
            res.json({ status: 'ok' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

function deleteFollow(userId, subscriberId, element) {
    return new Promise((resolve, reject) => {
        User.findById(userId, (error, user) => {
            let index = user[element].indexOf(subscriberId);
            if (index === -1) reject({ message: 'you not follow user'});
            user[element].splice(index, 1);
            // resolve(user[element]);
            if (element === 'followers') {
                User.findByIdAndUpdate(userId,
                    {
                        $set: {
                            followers: user[element]
                        }
                    }, { new: true },
                    (error, data) => {
                        if (error) reject(error);
                        resolve(data);
                    });
            } else if (element === 'following') {
                User.findByIdAndUpdate(userId,
                    {
                        $set: {
                            following: user[element]
                        }
                    }, { new: true },
                    (error, data) => {
                        if (error) reject(error);
                        resolve(data);
                    });
            } else {
                reject('have not filed');
            }
        });
    });
}

module.exports = following;
