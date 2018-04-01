const registration = require('express').Router();
const jwt = require('jsonwebtoken');


const saveUser = require('./../../database/createUser');

registration.post('/',
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
                res.status(500).json({
                    error
                });
            });
    });



module.exports = registration;
