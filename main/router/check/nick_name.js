const express = require('express');
const User = require('./../../models/user');

const nickName = express.Router();

nickName.get('/:nick', (req, res) => {
    let nick = req.params.nick;
    User.findOne({ nick_name: nick })
        .then(resutl => {
            if(resutl == null) {
                res.sendStatus(404);
            } else {
                console.log(resutl);
                res.sendStatus(200);
            }
        })
        .catch(() => {
            // console.error(err);
            res.sendStatus(404);
        });
});

module.exports = nickName;
