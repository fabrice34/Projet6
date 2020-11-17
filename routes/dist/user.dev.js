"use strict";

var express = require('express');

var router = express.Router();

var userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router["delete"]('/:id', userCtrl.deleteOneUser);
router.get('/', userCtrl.allUsers);
module.exports = router;