const jwt = require('jsonwebtoken');
/*Au niveau de ce middleware auth.js ici avec mon jsonwebtoken,je viens recuperer mon token lorsque je me connecte 
dans le header autorization, je le decode .
je verifie que le token qui à été attribué lors de ma connexion soit le meme que lorsque je supprime ou que je modifie
et qui me permet tout simplement de verifier et de valider la requette la!
si ce n'est pas bon en comparant les deux token alors 'user id non valable' et si c'est bon alors on continue
*/

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }

};