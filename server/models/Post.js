const mongoose = require("mongoose");

// On crée notre première table dans la bdd 

const Schema = mongoose.Schema;
const PostSchema = new mongoose.Schema({
    // On définit les props de chaque article 
    title: {
    type: String,
    required: true
    },
    body: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// On exporte le modèle 
module.exports = mongoose.model("Post", PostSchema);
// On peut maintenant l'utiliser