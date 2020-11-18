/* page contenant la logique routine (les routes dispnibles dans notre application) */
const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.findAllSauces);/*route traitera la récupération de la liste de Things en vente*/
router.get('/:id', auth, saucesCtrl.findOneSauce);/* route qui traite la récupération d'un Thing spécifique*/
router.post('/', auth, multer, saucesCtrl.createSauce);/*route qui traitera l'enregistrements de sauce (schema de donnée) dans la base de donnée*/
router.put('/:id', auth, multer, saucesCtrl.modifySauce); /* route pour la modification de donnée */
router.delete('/:id', auth, saucesCtrl.deleteSauce); /* route pour la supression de donnée  */

module.exports = router;