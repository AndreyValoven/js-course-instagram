const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./../../models/user');
const valideteEmail = require('./../../functions/validate_email');

const authoriztion = express.Router();

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
                if(user == null || !bcrypt.compareSync(body.pwd, user.pwd)) {
                    res.status(404).json({
                        mes: 'wrong pasword or email'
                    });
                } else {
                    let token = jwt.sign({ user: user ,}, 'secret');
                    res.type('json');
                    res.status(200).json({token});
                }

            })
            .catch(err => {
                res.status(504).json({
                    error: err
                });
            });
    });



module.exports = authoriztion;
