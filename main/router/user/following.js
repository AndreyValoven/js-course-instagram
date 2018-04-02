const following = require('express').Router();

const User = require('./../../models/user');
// const varyfiToken = require('./../../functions/verify_token');

following.get('/', (req, res) => {
    let url = req.originalUrl.split('/');
    const id = url[3];
    User.findById( id, (error, user) => {
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


// following.patch('/', varyfiToken,
//     (req, res) => {
//         // todo
//         let url = req.originalUrl.split('/');
//         const id = url[3];
//         User.findById(req.id, (error, data) => {
//             if (error) return res.status(500).json({ error });

//         });
// });

module.exports = following;
