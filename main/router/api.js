const api = require('express').Router();

const registration = require('./login/registration');
const authoriztion = require('./login/authorization');
const email = require('./check/email');
const nickName = require('./check/nick_name');
const image = require('./image/index');

api.use('/registration', registration);
api.use('/authorization', authoriztion);
api.use('/check/email', email);
api.use('/check/nick_name', nickName);
api.use('/image', image);


api.use('/user', require('./user/user'));


module.exports = api;
