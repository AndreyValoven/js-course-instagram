module.exports = (req, res, next) => {
    const headerToken = req.headers['authorization'];
    if(typeof headerToken !== 'undefined') {
        const tokenArr = headerToken.split(' ');
        const tokenKey = tokenArr[1];
        req.token = tokenKey;
        next();
    } else {
        res.sendStatus(403);
    }
};
