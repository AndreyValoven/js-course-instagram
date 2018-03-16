const registration = require('express').Router();
const jwt = require('jsonwebtoken');
const saveUser = require('./../../database/createUser');

const valideteEmail = require('./../../functions/validate_email');
const User = require('./../../models/user');

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
        !valideteEmail(body.email)
    ) {
        return true;
    } else {
        return false;
    }

}

registration.post('/',
    (req, res, next) => {
        const body = req.body;
        if(checkValues(body)) {
            res.status(500).json({
                error: 'empty values or not corect email'
            });
        } else {
            next();
        }
    },
    (req, res, next) => {
        const body = req.body;
        User.find({ email: body.email })
            .then(user => {
                if(typeof user !== 'undefined' && user.length > 0) {
                    res.status(500).json({
                        mes: 'email is not free'
                    });
                } else {
                    next();
                }
            })
            .catch(error => {
                res.status(500).json({
                    mes: error
                });
            });
    },
    (req, res, next) => {
        const body = req.body;
        User.find({ nick_name: body.nick_name })
            .then(user => {
                if(typeof user !== 'undefined' && user.length > 0) {
                    res.status(500).json({
                        mes: 'nick name is not free'
                    });
                } else {
                    next();
                }
            })
            .catch(error => {
                res.status(500).json({
                    error: error
                });
            });
    },
    (req, res) => {
        const body = req.body;

        saveUser(body)
            .then(result => {
                let token = jwt.sign({ user: {id: result._id, nick_name: result.nick_name} ,}, process.env.SECRET_KEY);
                res.type('json');
                res.status(200).json({
                    token,
                    result: {
                        _id: result._id,
                        nick_name: result.nick_name
                    }
                });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({
                    error
                });
            });
    });



module.exports = registration;
