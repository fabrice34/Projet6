"use strict";

/* déclaration de la constante express et utilisation de la commande require pour importer express*/
var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
/* Mongoose est un package qui facilite les interactions avec notre base de données MongoDB grâce à des fonctions extrêmement utiles.*/


var path = require('path');

var helmet = require("helmet");
/* plugin de sécurité pour les requêtes HTTP, les headers, protection XSS, détection du MIME TYPE...*/


var saucesRoutes = require('./routes/sauces');
/*Import des routes*/


var userRoutes = require('./routes/user');

require('dotenv').config();
/*Données DB Mongo cachées*/


mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_CONNECT,
/*logique pour se connecter à mongodb*/
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('Connexion à MongoDB réussie !');
})["catch"](function () {
  return console.log('Connexion à MongoDB échouée !');
});
var app = express();
app.use(helmet());
/* Exécution du plugin de sécurité*/

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
/* Gestion de la ressource image de façon statique*/

app.use('/api/sauces', saucesRoutes);
/*route de l'API*/

app.use('/api/auth', userRoutes);
module.exports = app;