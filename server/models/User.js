const mongoose = require("mongoose");

// On crée notre première table dans la bdd 

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