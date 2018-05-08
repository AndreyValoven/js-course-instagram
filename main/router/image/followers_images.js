const followersImages = require('express').Router();

const varyfiToken = require('./../../functions/verify_token');
const User = require('./../../models/user');
const Image = require('./../../models/image');

// need to rest this route
followersImages.get('/', varyfiToken, (req, res) => {
    if (typeof(req.id) === 'undefined') return res.status(403).json({ erorr: 'Forbidden'});
    User.findById(req,id, (error, user) => {
        if (error) return res.status(500).json({ error });
        Image.find(
            {
                user_id: user.following
            },
            (error, images) => {
                if (error) return res.status(500).json({ error });
                images = images.map(item => {
                    return {
                        id: item.id,
                        user_id: item.user_id,
                        url: item.url
                    };
                });
                res.json({images});
            });
    });
});





module.exports = followersImages;
