/*stock toute la logique métier de notre application*/
const Sauce = require('../models/Sauce');
const fs = require('fs');  /*package filesystem de node. Pour avoir accès aux différentes opérations liées aux fichiers*/

//Fonction d'ajout d'une nouvelle sauce (requête POST
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
      /*utilisation de l'opérateur spread ... qui copie tous les éléments de req.body*/
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch(error => res.status(400).json({ error }));
};

//Fonction de modification de l'objet sauce (requête PUT)
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({ error }));
};

//Fonction de suppression d'une sauce (requête DELETE)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Fonction d'envoi au front de l'objet sauce demandé (requête GET)
exports.findOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Fonction d'envoi au front de toutes les sauces (requête GET)
exports.findAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};




// fonction traitement des requetes portant sur les likes de sauces (requête POST)
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}) //Recherche de la sauce dans la DB
  .then((sauce) => { //On récupère les likes et dislikes de la sauce avant mise à jour
      var likes = sauce.likes;
      var dislikes = sauce.dislikes;
      var usersLiked = sauce.usersLiked;
      var usersDisliked = sauce.usersDisliked;
      //Cas où l'utilisateur like une sauce qu'il n'a pas déjà liké
      if (req.body.like==1 && !(usersLiked.includes(req.body.userId))) {
        likes+=1;
        usersLiked.push(req.body.userId);
      }
      //Cas où l'utilisateur dislike une sauce qu'il n'a pas déjà disliké
      else if (req.body.like==-1 && !(usersDisliked.includes(req.body.userId))) {
        dislikes+=1;
        usersDisliked.push(req.body.userId);
      }
      //Cas où l'utilisateur "dé-like" une sauce
      else if (req.body.like == 0 && usersLiked.includes(req.body.userId)) {
        likes-=1;
        var index = usersLiked.indexOf(req.body.userId);
            if (index > -1) {usersLiked.splice(index, 1);}
      }
      //Cas où l'utilisateur "dé-dislike" une sauce
      else if (req.body.like == 0 && usersDisliked.includes(req.body.userId)) {
        dislikes-=1;
        var index = usersDisliked.indexOf(req.body.userId);
            if (index > -1) {usersDisliked.splice(index, 1);}
      }
    //Mise à jour de la DB pour la partie like/dislike
    Sauce.updateOne({ _id: req.params.id }, {
      likes:likes,
      dislikes:dislikes,
      usersLiked:usersLiked,
      usersDisliked:usersDisliked,
      _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Like pris en compte'}))
      .catch(error => res.status(400).json({ error }))
  })
  .catch((error) => {res.status(404).json({error});});
}