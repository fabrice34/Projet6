const mongoose = require('mongoose');  /*création schema de données :utilisé Mongoose pour créer un modèle de données
                                       afin de faciliter les opérations de la base de données */


const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Object, required: true },
    usersDisliked: { type: Object, required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);