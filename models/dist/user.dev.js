"use strict";

var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

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