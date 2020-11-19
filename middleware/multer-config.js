const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

 /* multer permet d'implémenter des téléchargements de fichiers pour que 
 les utilisateurs puissent télécharger des images d'articles à vendre*/
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');