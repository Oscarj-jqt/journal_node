// Ce fichier sert à la création du modèle pour les utilisateurs de la bdd

const mongoose = require("mongoose");

// On crée la seconde table pour les utilisateurs

const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
    // On définit les props de chaque article 
    username: {
    type: String,
    required: true,
    unique: true
    },
    password: {
        type: String,
        required: true
        }
});

// On exporte le modèle 
module.exports = mongoose.model("User", UserSchema);
// On peut maintenant l'utiliser