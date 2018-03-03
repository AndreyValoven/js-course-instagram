const express = require('express');
const jwt = require('jsonwebtoken');

const registration = require('./login/registration');
const authoriztion = require('./login/authorization');
const varyfiToken = require('./../functions/verufi_token');
const email = require('./check/email');
const nickName = require('./check/nick_name');

let api = express.Router();

api.use('/registration', registration);
api.use('/authoriztion', authoriztion);
api.use('/check/email', email);
api.use('/check/nick_name', nickName);


api.use('/user',varyfiToken, (req, res) => {
    let token = req.token;
    jwt.verify(token, 'secret', (err, data) => {
        if(!err) {
            res.json(data);
        } else {
            res.sendStatus(403);
        }
    });
});


module.exports = api;
