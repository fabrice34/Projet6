//* on déclare express , mes routes, mon usercontrollers avec l'adresse du controller
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//mes routes à utilisés pour chaque middleware du user.js dans controllers
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.limiter, userCtrl.login);


module.exports = router;

