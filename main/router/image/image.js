const image = require('express').Router;

const Image = require('./../../models/image');
const varyfiToken = require('./../../functions/verify_token');

image.get('/:id', varyfiToken,
    (req, res) => {
        // todo dont check work this route
        // write script for autorization users
        const id = req.params.id;
        Image.findById(id, (error, image) => {
            if (error) return res.status(500).json({ error });
            req.json({
                user_id: image.user_id,
                url: image.url,
                date: image.date,
                tags: image.tags,
                likes: image.likes.legth
            });
        });
    });

// todo write script for creating new image
// image.post('/new', varyfiToken,
//     (req, res) => {

//     }
// );

module.exports = image;
