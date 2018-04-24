const image = require('express').Router();


const s3 = require('./../../image_config/s3');
const upload = require('./../../image_config/upload');
const Image = require('./../../models/image');
const varyfiToken = require('./../../functions/verify_token');
const saveImage = require('./../../database/uploadImage');

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
image.post('/upload', varyfiToken,
    (req, res) => {
        if (typeof(req.id) === 'undefined') {
            return res.status(403).json({ erorr: 'Forbidden'});
        }
        upload(req, res, (error) => {
            if (error) return res.status(500).json({ error });
            let fileType = req.file.mimetype.split('/');
            fileType = fileType[1];
            console.log(fileType);
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
                        console.log(image);
                        return res.json({ image });
                    })
                    .catch(error => {
                        return res.status(500).json({ error });
                    });
                // console.log("Object is public at https://s3.amazonaws.com/" +
                // s3Params.Bucket + "/" + s3Params.Key);
            });
        });

    }
);

module.exports = image;
