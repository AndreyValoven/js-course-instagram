const jwt = require('jsonwebtoken');
const User = require('./../models/user');

module.exports = (req, res, next) => {
    const headerToken = req.headers['authorization'];
    if(typeof headerToken !== 'undefined') {
        const tokenArr = headerToken.split(' ');
        const tokenKey = tokenArr[1];
        let user = jwt.verify(tokenKey, process.env.SECRET_KEY);
        User.findOne({ _id: user.id })
            .then(user => {
                if ( user._id != null ) {
                    req.id = user._id;
                    next();
                } else {
                    next();
                }
            }).catch(() => {
                next();
            });
    } else {
        next();
    }
};
