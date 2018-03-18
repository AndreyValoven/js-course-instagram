const authoriztion = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('./../../models/user');
const valideteEmail = require('./../../functions/validate_email');

authoriztion.post('/',
    (req, res, next) => {
        const body = req.body;
        if(
            typeof body.email === 'undefined' ||
            typeof body.pwd === 'undefined' ||
            body.email.replace(/ /, '') === '' ||
            body.pwd.replace(/ /, '') === '' ||
            !valideteEmail(body.email)
        ) {
            res.status(500).json({
                error: 'empty values or not corect email'
            });
        } else {
            next();
        }
    },
    (req, res) => {
        const body = req.body;
        User.findOne({ email: body.email })
            .then(user => {
                if(user == null) {
                    res.status(404).json({
                        mes: 'empy request'
                    });
                } else {
                    user.comparePwd(body.pwd, function(err, isMatch) {
                        if (!isMatch) {
                            return res.status(404).json({
                                error: "wrong password"
                            });
                        }
                        let token = jwt.sign({ id: user._id, nick_name: user.nick_name }, process.env.SECRET_KEY);
                        res.type('json');
                        res.status(200).json({
                            token,
                            user: {
                                _id: user._id,
                                nick_name: user.nick_name
                            }
                        });
                    });

                }

            })
            .catch(err => {
                res.status(504).json({
                    error: err
                });
            });
    });



module.exports = authoriztion;
