"use strict";

var bcrypt = require('bcrypt'); // protection du mot de passe utilisateur


var jwt = require('jsonwebtoken'); // token de protection


var rateLimit = require("express-rate-limit");

var User = require('../models/User');
/* au niveau du middleware signup on utilisera bcrypt qui va nous permettre de hacher
 (augmente ne niveau de protection),de proteger le mdp lors de l'inscription sur le site de l'utilisation,
 on creer l'user et on le sauvegarde */


exports.signup = function (req, res, next) {
  bcrypt.hash(req.body.password, 10) //Algoryhtme de hashage du mot de passe(on hash le mdp et on le sale 10fois )
  .then(function (hash) {
    var user = new User({
      //creer le nouveau user
      email: req.body.email,
      password: hash //Le hash est sauvegardé dans la base et non le mot de passe en clair

    });
    user.save().then(function () {
      return res.status(201).json({
        message: 'Utilisateur créé'
      });
    })["catch"](function (error) {
      return res.status(400).json({
        error: error
      });
    });
  })["catch"](function (error) {
    return res.status(500).json({
      error: error
    });
  });
};
/* au niveau du middleware login on vient chercher par rapport à l'adresse email:
avec la fonction user.findone() dans le cas ou il n'a pas d'utilisateur enregistré 
avec celui la => "utilisateur non trouvé"
mais s'il est bon, bcrypte va compararer les 2 mdp et que si la comparaison des hashs sont valide 
alors on nous retournerra un user.id et un token ( on retrouvera se token sur la protection des routes)
 */


exports.login = function (req, res, next) {
  User.findOne({
    email: req.body.email
  }).then(function (user) {
    if (!user) {
      //Cas où il n'y a pas d'utilisateur enregistré avec cette adresse e-mail
      return res.status(401).json({
        error: 'Utilisateur non trouvé'
      });
    }

    bcrypt.compare(req.body.password, user.password) //Comparaison des hashs pour voir si le mot de passe est valide
    .then(function (valid) {
      if (!valid) {
        return res.status(401).json({
          error: 'Mot de passe incorrect'
        });
      }

      res.status(200).json({
        userId: user.id,
        token: jwt.sign({
          userId: user._id
        }, 'RANDOM_TOKEN_SECRET', {
          expiresIn: '24h'
        })
      });
    })["catch"](function (error) {
      return res.status(500).json({
        error: error
      });
    });
  })["catch"](function (error) {
    return res.status(500).json({
      error: error
    });
  });
};

exports.limiter = rateLimit({
  // pour bloquer la connexion aprés trop de tentative de connexion     
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 2 // limiter chaque IP à 2 demandes par fenêtreMs

});