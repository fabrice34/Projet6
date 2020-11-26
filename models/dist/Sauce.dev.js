"use strict";

var mongoose = require('mongoose');
/*création schema de données :utilisé Mongoose pour créer un modèle de données
 afin de faciliter les opérations de la base de données */


var sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainPepper: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  heat: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  dislikes: {
    type: Number,
    required: true
  },
  usersLiked: {
    type: Array,
    required: true
  },
  usersDisliked: {
    type: Array,
    required: true
  }
});
module.exports = mongoose.model('Sauce', sauceSchema);