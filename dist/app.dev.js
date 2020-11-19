"use strict";

// déclaration de la constante express et utilisation de la commande require pour importer express
var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
/* Mongoose est un package qui facilite les interactions avec notre base de données MongoDB grâce à des fonctions extrêmement utiles.*/


var path = require('path');

var saucesRoutes = require('./routes/sauces');

var userRoutes = require('./routes/user');

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://user_34:projet_6@cluster0.5vj6g.mongodb.net/SoPeckoko?retryWrites=true&w=majority', {
  useNewUrlParser: true,

  /*logique pour se connecter à mongodb*/
  useUnifiedTopology: true
}).then(function () {
  return console.log('Connexion à MongoDB réussie !');
})["catch"](function () {
  return console.log('Connexion à MongoDB échouée !');
});
var app = express();
app.use(function (req, res, next) {
  /* Système de sécurité CORS : Cross Origin Resource Sharing */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());
/*Requêtes exploitables (Transformer le corps de la requête en objet javascript utilisable grâce à la méthode json() de bodyParser)*/

app.use('/images', express["static"](path.join(__dirname, 'images')));
/*permet de recuperer des images du local*/

app.use('/api/sauces', saucesRoutes);
/*Import des routes*/

app.use('/api/auth', userRoutes);
module.exports = app;