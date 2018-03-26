const valideteEmail = require('./validate_email');
module.exports = function(body) {
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
};
