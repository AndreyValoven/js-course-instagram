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

image.delete('/:id', varyfiToken, (req, res) => {
    if (typeof(req.id) === 'undefined') {
        return res.status(403).json({ erorr: 'Forbidden'});
    }
    let id = req.params.id;
    Image.findById(id, (error, image) => {
        if (error) return res.status(500).json({ error });
        if (req.id + '' !== image.user_id + '') return res.status(403).jons({ erorr: 'Forbidden' });

    });
});


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
                            file_name: fileName,
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

// need to test
image.delete('/:id', varyfiToken,
    (req, res)=>{
        if (typeof(req.id) === 'undefined') {
            return res.status(403).json({ erorr: 'Forbidden'});
        }
        Image.findById(req.params.id, (error, image) => {
            if (error) return res.status(500).json({ error });
            Promise.all(deleteImageS3(image.file_name), deleteImageDB(image._id))
                .then(data => {
                    res.json({ data });
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        });
    });

function deleteImageS3(key) {
    return new Promise((resolve, reject) => {
        const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key
        };
        s3.deleteObject(s3Params, function(error, data) {
            if (err) reject(error);
            resolve(data);
        });
    });
}

function deleteImageDB(id) {
    return new Promise((resove, reject) => {
        Image.findByIdAndRemove(id, (error, image) => {
            if (error) reject(error);
            resovle(image);
        });
    });
}

module.exports = image;
