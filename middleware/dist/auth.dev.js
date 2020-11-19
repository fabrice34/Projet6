"use strict";

var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    var token = req.headers.authorization.split(' ')[1];
    var decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    var userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw 'User Id non valable';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error | 'Requête non authentifiée'
    });
  }
};