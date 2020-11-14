 /* page contenant la logique routine (les routes dispnibles dans notre application) */
 const express = require('express');
 const router = express.Router();  
 
 
 
 const stuffCtrl = require('../controllers/stuff');
 const auth = require('../middleware/auth');
 const multer = require('../middleware/multer-config');
 
 router.post('/', auth, multer, stuffCtrl.createThing); /*route qui traitera l'enregistrements de thing (schema de donnée) dans la base de donnée*/
 router.put('/:id', auth, multer,  stuffCtrl.modifyThing);/* route pour la modification de donnée */
 router.delete('/:id',  auth, stuffCtrl.deleteThing);/* route pour la supression de donnée  */
 router.get('/:id', auth, stuffCtrl.getOneThing); /* route qui traite la récupération d'un Thing spécifique*/
 router.get('/', auth, stuffCtrl.getAllThings);/*route traitera la récupération de la liste de Things en vente*/
 
 module.exports = router;