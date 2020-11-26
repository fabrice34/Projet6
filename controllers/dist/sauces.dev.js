"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*stock toute la logique métier de notre application*/
var Sauce = require('../models/Sauce');

var fs = require('fs');
/*package filesystem de node. Pour avoir accès aux différentes opérations
    liées aux fichiers*/

/*Fonction d'ajout d'une nouvelle sauce (requête POST)  
la logique de notre route POST en tant que fonction appelée createSauce()*/


exports.createSauce = function (req, res, next) {
  var sauceObject = JSON.parse(req.body.sauce); // on recupere la sauce

  delete sauceObject._id; //L'id de la sauce est suprimé

  var sauce = new Sauce(_objectSpread({}, sauceObject, {
    /*utilisation de l'opérateur spread ... qui copie tous les éléments de req.body*/
    imageUrl: "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename),
    //variable pour l'implantation de l'image
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  }));
  sauce.save() // on sauvegarde la nouvelle sauce 
  .then(function () {
    return res.status(201).json({
      message: 'Sauce enregistrée'
    });
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
};
/*lorsque l'on veux chercher une sauce bien précise:
Fonction d'envoi au front de l'objet sauce demandé (requête GET) 
avec la méthode findOne avec lequelle il faut bien verifié l'id de la sauce pour etre sur la bonne sauce 
et donc qui va nous retouné cette sauce spécifique*/


exports.findOneSauce = function (req, res, next) {
  Sauce.findOne({
    _id: req.params.id
  }).then(function (sauce) {
    return res.status(200).json(sauce);
  })["catch"](function (error) {
    return res.status(404).json({
      error: error
    });
  });
}; //Fonction de modification de l'objet sauce (requête PUT)


exports.modifySauce = function (req, res, next) {
  var sauceObject = req.file ? //on recupere la sauce
  _objectSpread({}, JSON.parse(req.body.sauce), {
    // on rend les données de la sauce exploitable avec JSON.parse
    imageUrl: "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename)
  }) : _objectSpread({}, req.body);
  /*ensuite avec la fonction updateOne pour recuperé la sauce en question avec son _id
   et ensuite modifier tout les parametres de la sauce */

  Sauce.updateOne({
    _id: req.params.id
  }, _objectSpread({}, sauceObject, {
    _id: req.params.id
  })).then(function () {
    return res.status(200).json({
      message: 'Sauce modifiée'
    });
  }) // et on retoune tjrs un then et catch
  ["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
}; //Fonction de suppression d'une sauce (requête DELETE)


exports.deleteSauce = function (req, res, next) {
  Sauce.findOne({
    _id: req.params.id
  }) // on vient chercher la sauce
  .then(function (sauce) {
    var filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink("images/".concat(filename), function () {
      //fs.unlink me permet de supprimer sur mes fichiers systeme l'image en question
      Sauce.deleteOne({
        _id: req.params.id
      }) // on supprime la sauce
      .then(function () {
        return res.status(200).json({
          message: 'Sauce supprimée'
        });
      })["catch"](function (error) {
        return res.status(400).json({
          error: error
        });
      });
    });
  })["catch"](function (error) {
    return res.status(500).json({
      error: error
    });
  });
}; //Fonction d'envoi au front de toutes les sauces (requête GET) methode find et qui va nous retourné toute les sauces


exports.findAllSauces = function (req, res, next) {
  Sauce.find().then(function (sauces) {
    return res.status(200).json(sauces);
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
}; // fonction traitement des requetes portant sur les likes de sauces (requête POST)


exports.likeSauce = function (req, res, next) {
  Sauce.findOne({
    _id: req.params.id
  }) //Recherche de la sauce dans la DB
  .then(function (sauce) {
    //On récupère les likes et dislikes de la sauce avant mise à jour
    var likes = sauce.likes;
    var dislikes = sauce.dislikes;
    var usersLiked = sauce.usersLiked;
    var usersDisliked = sauce.usersDisliked; //Cas où l'utilisateur like une sauce qu'il n'a pas déjà liké

    if (req.body.like == 1 && !usersLiked.includes(req.body.userId)) {
      //Si j'aime = 1,l'utilisateur aime la sauce
      likes += 1; // on ajoute la qté 1 d'utilisateur qui aime la sauce dans mon tableau(object) usersliked

      usersLiked.push(req.body.userId); // push dans mon tableau usersliked  
    } //Cas où l'utilisateur dislike une sauce qu'il n'a pas déjà disliké
    else if (req.body.like == -1 && !usersDisliked.includes(req.body.userId)) {
        //Si j'aime =-1, l'utilisateur n'aime pas la sauce
        dislikes += 1; // on ajoute de 1 la qté  d'utilisateur qui n'aime pas la sauce  dans mon tableau(object) usersdisliked

        usersDisliked.push(req.body.userId); // push dans mon tableau usersdisliked
      } //Cas où l'utilisateur "dé-like" une sauce
      else if (req.body.like == 0 && usersLiked.includes(req.body.userId)) {
          //si j'aime= 0, l'utilisateur annule ce qu'il aime 
          likes -= 1; //ici on enleve de 1 la qté  d'utilisateur (on enleve le like)  dans mon tableau(object) usersliked

          var index = usersLiked.indexOf(req.body.userId); //enleve de 1 dans le tableau userliked

          if (index > -1) {
            usersLiked.splice(index, 1);
          }
        } //Cas où l'utilisateur "dé-dislike" une sauce
        else if (req.body.like == 0 && usersDisliked.includes(req.body.userId)) {
            //si j'aime= 0, l'utilisateur annule ce qu'il n'aime pas
            dislikes -= 1; //ici  on enleve de 1 la qté d'utilsateur (on enleve le dislike)  dans mon tableau(object) usersdisliked

            var index = usersDisliked.indexOf(req.body.userId); // enleve de 1 dans le tableau userdisliked

            if (index > -1) {
              usersDisliked.splice(index, 1);
            }
          } //Mise à jour de la DB pour la partie like/dislike


    Sauce.updateOne({
      _id: req.params.id
    }, {
      likes: likes,
      dislikes: dislikes,
      usersLiked: usersLiked,
      usersDisliked: usersDisliked,
      _id: req.params.id
    }).then(function () {
      return res.status(200).json({
        message: 'Like pris en compte'
      });
    })["catch"](function (error) {
      return res.status(400).json({
        error: error
      });
    });
  })["catch"](function (error) {
    res.status(404).json({
      error: error
    });
  });
};