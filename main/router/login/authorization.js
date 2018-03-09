const express = require('express');
const jwt = require('jsonwebtoken');

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
        console.log(req.body);
        const body = req.body;
        User.findOne({ email: body.email })
            .then(user => {
                if(user == null || user.pwd !== body.pwd) {
                    res.status(404).json({
                        mes: 'wrong pasword or email'
                    });
                } else {
                    let token = jwt.sign({ user: user ,}, 'secret');
                    res.type('json');
                    res.status(200).json({token});
                }
            })
            .catch(error => {
                res.status(504).json({
                    error: error
                });
            });
    });



module.exports = authoriztion;
