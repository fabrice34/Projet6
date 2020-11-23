const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const User = require('../models/User');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)//Algoryhtme de hashage du mot de passe
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash //Le hash est sauvegardé dans la base et non le mot de passe en clair
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {//Cas où il n'y a pas d'utilisateur enregistré avec cette adresse e-mail
            return res.status(401).json({  error: 'Utilisateur non trouvé'});
        }
        bcrypt.compare(req.body.password, user.password)//Comparaison des hashs pour voir si le mot de passe est valide
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({  error: 'Mot de passe incorrect'});
                }
                res.status(200).json({ 
                    userId: user.id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.limiter = rateLimit({  // pour bloquer la connexion aprés trop de tentative de connexion     
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2 // limiter chaque IP à 2 demandes par fenêtreMs
  });


