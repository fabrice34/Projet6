"use strict";

/* page contenant la logique routine (les routes dispnibles dans notre application) */
var express = require('express');

var router = express.Router();

var saucesCtrl = require('../controllers/sauces');

var auth = require('../middleware/auth');

var multer = require('../middleware/multer-config');
/* multer permet d'implémenter des téléchargements de fichiers pour que 
 les utilisateurs puissent télécharger des images d'articles */


router.post('/', auth, multer, saucesCtrl.createSauce);
/*route qui traitera l'enregistrements de sauce (schema de donnée) dans la base de donnée*/

router.put('/:id', auth, multer, saucesCtrl.modifySauce);
/* route pour la modification de la sauce */

router["delete"]('/:id', auth, saucesCtrl.deleteSauce);
/* route pour la supression de la sauce  */

router.get('/', auth, saucesCtrl.findAllSauces);
/*route traitera la récupération de la liste de sauce */

router.get('/:id', auth, saucesCtrl.findOneSauce);
/* route qui traite la récupération d'un sauce spécifique*/

router.post('/:id/like', auth, saucesCtrl.likeSauce);
/* route pour les likes ou les dislikes des sauuce*/

module.exports = router;