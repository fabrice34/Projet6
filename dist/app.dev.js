"use strict";

var express = require('express');

var mongoose = require('mongoose');

var path = require('path');

var app = express();

var bodyParser = require('body-parser');

var saucesRoutes = require('./routes/sauces');

var userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://user_34:projet_6@cluster0.5vj6g.mongodb.net/SoPeckoko?retryWrites=true&w=majority', {
  useNewUrlParser: true,

  /*logique pour se connecter à mongodb*/
  useUnifiedTopology: true
}).then(function () {
  return console.log('Connexion à MongoDB réussie !');
})["catch"](function () {
  return console.log('Connexion à MongoDB échouée !');
});
app.use(function (req, res, next) {
  /* méthode permettant d'empêcher des erreurs CORS */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());
/*Requêtes exploitables*/

app.use('/images', express["static"](path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
/* les routes  */

app.use('/api/auth', userRoutes);
module.exports = app;