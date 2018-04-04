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
                                res.send('ok');
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

module.exports = following;
