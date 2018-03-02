const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const valideteEmail = require('./../../functions/validate_email');
const User = require('./../../models/user');

const registration = express.Router();

function checkValues(body) {
    if (
        typeof body.name === 'undefined' ||
        typeof body.nick_name === 'undefined' ||
        typeof body.email === 'undefined' ||
        typeof body.pwd === 'undefined' ||
        body.name.replace(/ /, '') === '' ||
        body.nick_name.replace(/ /, '') === '' ||
        body.email.replace(/ /, '') === '' ||
        body.pwd.replace(/ /, '') === '' ||
        valideteEmail(body.email)
    ) return true;
    return false;
}

registration.post('/', (req, res) => {
    const body = req.body;
    if(checkValues(body)) {
        return res.status(500).json({
            error: 'empty values or not corect email'
        });
    }
    let user = new User({
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        nick_name: body.nick_name,
        email: body.email,
        pwd: body.pwd,
        followers: [],
        following: [],
        avatar: ''
    });

    user.save()
        .then(result => {
            let token = jwt.sign({ user: result ,}, 'secret');
            res.type('json');
            res.status(200).json({token});
        })
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
});



module.exports = registration;
