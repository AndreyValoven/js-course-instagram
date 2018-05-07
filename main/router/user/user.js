const user = require('express').Router();
const sharp = require('sharp');

const varyfiToken = require('./../../functions/verify_token');
const checkValues = require('./../../functions/check_values');
const User = require('./../../models/user');
const Image = require('./../../models/image');
const upload = require('./../../image_config/upload');
const s3 = require('./../../image_config/s3');

user.use('/:id/following', require('./following'));


user.get('/:id/followers', (req, res) => {
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
    (req, res) => {
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
                    pwd: body.pwd,
                    name: body.name,
                    nick_name: body.nick_name,
                    email: body.email
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

//need to test todo
user.get('/images/:id', (req, res) => {
    let id = req.params.id;
    Image.find({
        user_id: id
    }, (error, images) => {
        if (error) return res.status(500).json({ error });
        images = images.map(item => {
            return {
                id: item._id,
                url: item.url
            };
        });
        res.json({images});
    });
});


user.post('/avatar', varyfiToken, (req, res) => {
    if (typeof(req.id) === 'undefined') {
        return res.status(403).json({ erorr: 'Forbidden'});
    }
    User.findById(req.id, (error, user) => {
        if (error) return res.status(500).json({ error });
        if (user.avatar !== '' ) {
            Promise.all([deleteImageS3(user.avatar), uploadAvatar(req, res)])
                .then(data => {
                    console.log(data);
                    User.findById(req.id, (error, user) => {
                        if (error) return res.status(500).json({ error });
                        res.json({ user });
                    });
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        } else {
            uploadAvatar(req, res)
                .then(user => {
                    res.json({ user });
                })
                .catch(error => {
                    res.status(500).json({ type: 'some', error });
                });
        }
    });
});


function deleteImageS3(key) {
    return new Promise((resolve, reject) => {
        const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key
        };
        s3.deleteObject(s3Params, function(error, data) {
            if (error !== null) reject({type: 'S3', error});
            resolve(data);
        });
    });
}



function uploadAvatar(req, res) {
    return new Promise((resolve, reject) => {
        upload(req, res, (error) => {
            if (error) return reject(error);
            let fileType = req.file.mimetype.split('/');
            fileType = fileType[1];
            let fileName = req.id + '-avatar.' + fileType;
            sharp(req.file.buffer)
                .rotate()
                .resize(350)
                .toBuffer()
                .then( image => {
                    const s3Params = {
                        Bucket: process.env.BUCKET_NAME,
                        Body: image,
                        Key: fileName,
                        ContentType: req.file.mimetype,
                        ACL: 'public-read'
                    };

                    s3.putObject(s3Params, (error, data) => {
                        if (error) return reject(error);
                        User.findByIdAndUpdate(req.id,
                            {
                                $set: {
                                    avatar: `https://s3.amazonaws.com/${s3Params.Bucket}/${s3Params.Key}`
                                }
                            }, { new: true },
                            (error, user) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve(user);
                            });
                        resolve(data);
                    });
                })
                .catch( error => {
                    reject(error);
                });
        });
    });
}

module.exports = user;
