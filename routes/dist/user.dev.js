"use strict";

//* on déclare express , mes routes, mon usercontrollers avec l'adresse du controller
var express = require('express');

var router = express.Router();

var userCtrl = require('../controllers/user'); //mes routes à utilisés pour chaque middleware du user.js dans controllers


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.limiter, userCtrl.login);
module.exports = router;