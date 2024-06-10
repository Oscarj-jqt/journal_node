// Ce fichier sert à à la la mise en place de la connexion à la base de donnée 

const mongoose = require("mongoose");
const connectDB = async () => {

    try {

        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connexion à la base de donnée : ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }

}

module.exports = connectDB;
//  On l'exporte pour pouvoir l'inclure dans app.js 