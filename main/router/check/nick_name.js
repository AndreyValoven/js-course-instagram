const express = require('express');
const User = require('./../../models/user');

const nickName = express.Router();

nickName.get('/:nick', (req, res) => {
    let nick = req.params.nick;
    if (nick.length >= 4 && nick.length <= 30) {
        User.findOne({ nick_name: nick })
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

module.exports = nickName;
