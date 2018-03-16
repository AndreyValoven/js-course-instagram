const api = require('express').Router();

const registration = require('./login/registration');
const authoriztion = require('./login/authorization');
const email = require('./check/email');
const nickName = require('./check/nick_name');

api.use('/registration', registration);
api.use('/authoriztion', authoriztion);
api.use('/check/email', email);
api.use('/check/nick_name', nickName);


api.use('/user', require('./user'));


module.exports = api;
