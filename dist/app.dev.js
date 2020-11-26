"use strict";

// Déclarer tout les require
require('dotenv').config();
/*protection de l'accés à la base de données*/


var helmet = require("helmet");
/* plugin de sécurité pour diverses attaques...*/


var express = require('express'); //déclaration framework express


var bodyParser = require('body-parser'); //déclaration body-parser pour recuperer des données exploitable


var mongoose = require('mongoose');
/* déclaration mongoose (package qui facilite les interactions 
avec notre base de données MongoDB)*/


var saucesRoutes = require('./routes/sauces');
/*déclaration du dossier des routes sauces donc import route sauces*/


var userRoutes = require('./routes/user'); //déclaration du dossier des route user donc import route user


var path = require('path'); // necessaire pour multer (l'importation de fichier comme les images)


var app = express(); // permet de créer une application express 

mongoose.set('useCreateIndex', true);
/*logique pour se connecter à mongodb*/

mongoose.connect(process.env.MONGODB_CONNECT, {
  /*au niveau de la déclaration de ma BD ,
   utilisation de dotenv pour masquer mes identifiants, 
   création du fichier .env pour stocker ces identifiants d'accés 
  et placement dans .gitignore */
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('Connexion à MongoDB réussie !');
})["catch"](function () {
  return console.log('Connexion à MongoDB échouée !');
});
app.use(function (req, res, next)
/* contourner les erreur de CORS (Système de sécurité CORS : Cross Origin Resource Sharing  
              La sécurité CORS est une mesure de sécurité par défaut pour empêcher 
              l'utilisation de ressources par des origines non-autorisées.*/
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(helmet());
/* Exécution du plugin de sécurité*/

app.use(bodyParser.json());
/*Requêtes exploitables (Transformer le corps de la requête
   en objet javascript utilisable grâce à la méthode json() de bodyParser)*/

app.use('/api/sauces', saucesRoutes);
/*route de l'API*/

app.use('/api/auth', userRoutes);
app.use('/images', express["static"](path.join(__dirname, 'images')));
/* Gestion de la ressource image 
  de façon statique*/

module.exports = app;