/* déclaration de la constante express et utilisation de la commande require pour importer express*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');  /* Mongoose est un package qui facilite les interactions avec notre base de données MongoDB grâce à des fonctions extrêmement utiles.*/
const path = require('path');
const helmet = require("helmet"); /* plugin de sécurité pour les requêtes HTTP, les headers, protection XSS, détection du MIME TYPE...*/
const saucesRoutes = require('./routes/sauces');/*Import des routes*/
const userRoutes = require('./routes/user');

require('dotenv').config() /*Données DB Mongo cachées*/

mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGODB_CONNECT,
  { 
    useNewUrlParser: true,             /*logique pour se connecter à mongodb*/
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(helmet()); /* Exécution du plugin de sécurité*/

app.use((req, res, next) => {            /* Système de sécurité CORS : Cross Origin Resource Sharing */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());  /*Requêtes exploitables (Transformer le corps de la requête en objet javascript utilisable grâce à la méthode json() de bodyParser)*/

app.use('/images', express.static(path.join(__dirname, 'images')));  /* Gestion de la ressource image de façon statique*/

app.use('/api/sauces', saucesRoutes); /*route de l'API*/
app.use('/api/auth', userRoutes);

module.exports = app;