const express = require('express');
const User = require('./../../models/user');

const email = express.Router();

email.get('/:email', (req, res) => {
    let email = req.params.email;
    User.findOne({ email: email })
        .then(resutl => {
            if(resutl == null) {
                res.sendStatus(404);
            }
            console.log(resutl);
            res.sendStatus(200);
        })
        .catch(() => {
            // console.error(err);
            res.sendStatus(404);
        });
});

module.exports = email;
