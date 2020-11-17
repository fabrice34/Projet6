"use strict";

var mongoose = require('mongoose');

var thingSchema = mongoose.Schema({
  /*création schema de données*/
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
    type: String,
    required: true
  },
  usersDisliked: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Thing', thingSchema);