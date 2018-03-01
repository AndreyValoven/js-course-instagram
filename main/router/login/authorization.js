const express = require('express');
const User = require('./../../models/user');
const jwt = require('jsonwebtoken');

const authoriztion = express.Router();

authoriztion.post('/', (req, res) => {
    console.log(req.body);
    const body = req.body;
    if(
        typeof body.email === 'undefined' ||
        typeof body.pwd === 'undefined' ||
        body.email.replace(/ /, '') === '' ||
        body.pwd.replace(/ /, '') === ''
    ) {
        return res.status(500).json({
            error: 'empty values'
        });
    }
    User.findOne({ email: body.email })
        .then(user => {
            console.log(user);
            if(user == null || user.pwd !== body.pwd) {
                res.sendStatus(404);
            } else {
                let token = jwt.sign({ user: user ,}, 'secret');
                res.type('json');
                res.status(200).json({token});
            }
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(404);
        });
});



module.exports = authoriztion;
