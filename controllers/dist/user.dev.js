"use strict";

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var User = require('../models/User');

exports.signup = function (req, res, next) {
  bcrypt.hash(req.body.password, 10).then(function (hash) {
    var user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(function () {
      return res.status(201).json({
        message: 'Utilisateur créé !'
      });
    })["catch"](function (error) {
      return res.status(400).json({
        error: error
      });
    });
  })["catch"](function (error) {
    return res.status(500).json({
      error: error
    });
  });
};

exports.login = function (req, res, next) {
  User.findOne({
    email: req.body.email
  }).then(function (user) {
    if (!user) {
      return res.status(401).json({
        error: 'Utilisateur non trouvé !'
      });
    }

    bcrypt.compare(req.body.password, user.password).then(function (valid) {
      if (!valid) {
        return res.status(401).json({
          error: 'Mot de passe incorrect !'
        });
      }

      res.status(200).json({
        userId: user._id,
        token: jwt.sign({
          userId: user._id
        }, 'RANDOM_TOKEN_SECRET', {
          expiresIn: '24h'
        })
      });
    })["catch"](function (error) {
      return res.status(500).json({
        error: error
      });
    });
  })["catch"](function (error) {
    return res.status(500).json({
      error: error
    });
  });
};

exports.allUsers = function (req, res, next) {
  User.find().then(function (users) {
    return res.status(200).json(users);
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
};

exports.deleteOneUser = function (req, res, next) {
  User.deleteOne({
    _id: req.params.id
  }).then(function () {
    return res.status(200).json({
      message: 'Utilisateur supprimé'
    });
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
};