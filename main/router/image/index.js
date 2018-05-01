const image = require('express').Router();


const s3 = require('./../../image_config/s3');
const upload = require('./../../image_config/upload');
const Image = require('./../../models/image');
const User = require('./../../models/user');
const varyfiToken = require('./../../functions/verify_token');
const saveImage = require('./../../database/uploadImage');

image.get('/:id', varyfiToken,
    (req, res) => {
        // todo dont check work this route
        // write script for autorization users
        const id = req.params.id;
        Image.findById(id, (error, image) => {
            if (error) return res.status(500).json({ error });
            User.findById(image.user_id, (err, user) => {
                if (err) return res.json({ error: err});
                res.json({
                    user_id: image.user_id,
                    nick_name: user.nick_name,
                    avatar: user.avatar,
                    url: image.url,
                    date: image.date,
                    tags: image.tags,
                    your_like: false,
                    likes: image.likes.legth
                });
            });
        });
    });

// todo write script for creating new image
image.post('/upload', varyfiToken,
    (req, res) => {
        if (typeof(req.id) === 'undefined') {
            return res.status(403).json({ erorr: 'Forbidden'});
        }
        upload(req, res, (error) => {
            if (error) return res.status(500).json({ error });
            let fileType = req.file.mimetype.split('/');
            fileType = fileType[1];
            let fileName = req.id + '-' + Date.now() + '.' + fileType;

            const s3Params = {
                Bucket: process.env.BUCKET_NAME,
                Body: req.file.buffer,
                Key: fileName,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
            };

            s3.putObject(s3Params, function (err) {
                if (err) {
                    return res.status(500).json({ err });
                }
                saveImage({
                    url: "https://s3.amazonaws.com/" + s3Params.Bucket + "/" + s3Params.Key,
                    userId: req.id
                })
                    .then(image => {
                        return res.json({
                            id: image._id,
                            user_id: image.user_id,
                            url: image.url,
                            likes: image.likes,
                            tags: image.tags
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({ error });
                    });
            });
        });

    }
);

module.exports = image;
