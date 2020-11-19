"use strict";

var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');
/*Pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail,
nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema*/


var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
userSchema.plugin(uniqueValidator);
/*On rajoute le validateur comme plugin à notre schéma*/

module.exports = mongoose.model('User', userSchema);