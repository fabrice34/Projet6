 /*stock toute la logique métier de notre application*/
const Thing = require('../models/thing');        
const fs = require('fs');

exports.createThing = (req, res, next) => {

 
  const thingObject = JSON.parse(req.body.thing)
  const thing = new Thing({
    userId: thingObject.userId,
    name: thingObject.name,
    manufacturer: thingObject.manufacturer,
    description: thingObject.description,
    mainPepper: thingObject.mainPepper,
    imageUrl: url + "/images/" + req.file.filename,
    heat: thingObject.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
});

  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};
  
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })                 /*  qui traite la récupération d'un Thing spécifique*/
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  }

  exports.getAllThings = (req, res, next) => {
    Thing.find()                                           /* traite la récupération de la liste de Things en vente*/
      .then(things => res.status(200).json(things))    
      .catch(error => res.status(400).json({ error }));
  }