const express = require('express');
const User = require('./../../models/user');
const validateEmail = require('./../../functions/validate_email');

const email = express.Router();

email.get('/:email', (req, res) => {
    let email = req.params.email;
    if (validateEmail(email)) {
        User.findOne({ email: email })
            .then(result => {
                console.log(result);
                if (result == null) {
                    res.status(200).json({
                        free: true
                    });
                } else {
                    res.status(200).json({
                        free: false
                    });
                }
            })
            .catch(() => {
                res.status(200).json({
                    free: true
                });
            });
    } else {
        res.status(200).json({
            free: false
        });
    }
});

module.exports = email;
