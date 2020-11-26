// Déclarer tout les require
require('dotenv').config() /*protection de l'accés à la base de données*/
const helmet = require("helmet"); /* plugin de sécurité pour diverses attaques...*/


const express = require('express'); //déclaration framework express
const bodyParser = require('body-parser'); //déclaration body-parser pour recuperer des données exploitable
const mongoose = require('mongoose');  /* déclaration mongoose (package qui facilite les interactions 
                                     avec notre base de données MongoDB)*/


const saucesRoutes = require('./routes/sauces');/*déclaration du dossier des routes sauces donc import route sauces*/
const userRoutes = require('./routes/user'); //déclaration du dossier des route user donc import route user

const path = require('path'); // necessaire pour multer (l'importation de fichier comme les images)

const app = express(); // permet de créer une application express 


mongoose.set('useCreateIndex', true);        /*logique pour se connecter à mongodb*/
mongoose.connect(process.env.MONGODB_CONNECT,  
  {                                        /*au niveau de la déclaration de ma BD ,
                                            utilisation de dotenv pour masquer mes identifiants, 
                                            création du fichier .env pour stocker ces identifiants d'accés 
                                           et placement dans .gitignore */

    useNewUrlParser: true,             
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => /* contourner les erreur de CORS (Système de sécurité CORS : Cross Origin Resource Sharing  
                                          La sécurité CORS est une mesure de sécurité par défaut pour empêcher 
                                          l'utilisation de ressources par des origines non-autorisées.*/
{ res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet()); /* Exécution du plugin de sécurité*/
app.use(bodyParser.json());  /*Requêtes exploitables (Transformer le corps de la requête
                                en objet javascript utilisable grâce à la méthode json() de bodyParser)*/


app.use('/api/sauces', saucesRoutes); /*route de l'API*/
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));  /* Gestion de la ressource image 
                                                                       de façon statique*/

module.exports = app;