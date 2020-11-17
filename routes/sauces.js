 /* page contenant la logique routine (les routes dispnibles dans notre application) */
 const express = require('express');
 const router = express.Router();  
 
 
 
 const saucesCtrl = require('../controllers/sauces');
 const auth = require('../middleware/auth');
 const multer = require('../middleware/multer-config');
 
 router.post('/', auth, multer, saucesCtrl.createThing); /*route qui traitera l'enregistrements de thing (schema de donnée) dans la base de donnée*/
 router.put('/:id', auth, multer,  saucesCtrl.modifyThing);/* route pour la modification de donnée */
 router.delete('/:id', auth, saucesCtrl.deleteThing);/* route pour la supression de donnée  */
 router.get('/:id', auth, saucesCtrl.getOneThing); /* route qui traite la récupération d'un Thing spécifique*/
 router.get('/', auth, saucesCtrl.getAllThings);/*route traitera la récupération de la liste de Things en vente*/
 
 
 module.exports = router;