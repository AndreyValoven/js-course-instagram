const followers = require('express').Router;

followers.get('/', (req, res) => {
    let url = req.originalUrl.split('/');
    const id = url[3];
    User.findById( id, (error, user) => {
        console.log(user);
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

module.exports = followers;
