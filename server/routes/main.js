// Ce fichier gère les routes principales

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Cette route affiche la page d'accueil listant les acticles avec pagination

router.get("/accueil", async (req, res) => {
    //render pour toute une page au lieu de mots
    //Renvoyer des données EJS
    // On crée l'objet ici
    
    // Cela va trouver tout les posts 
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "Un blog simple créé avec NodeJS, Express et MongoDb"
        }

        // Le nombre de page que l'on veut afficher 
        let perPage = 2; 
        let page = req.query.page || 1;
        // Définit le nombre de posts à afficher par page (`perPage`)
        // et récupère le numéro de la page actuelle à partir de la requête (`req.query.page`).
        // Si aucune page n'est spécifiée, la page par défaut est la première (`1`).


        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        // Utilise l'agrégation MongoDB pour récupérer les posts de la base de données, 
        //triés par date de création décroissante (`$sort`).
        // Les résultats sont paginés en sautant (`skip`) les posts des pages précédentes
        // et en limitant (`limit`) le nombre de posts retournés à `perPage`.

        // Compte le nombre total de documents (posts) dans la collection.
        const count = await Post.countDocuments();

        const nextPage = parseInt(page) + 1
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        // Calcule le numéro de la prochaine page (`nextPage`) et détermine s'il y a une page suivante (`hasNextPage`).
        // `Math.ceil(count / perPage)` calcule le nombre total de pages nécessaires pour afficher tous les posts.

        res.render("index", { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage: null,
            currentRoute: "/"
            });


    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

});


// insertPostData();


router.post("/search", async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Un blog simple créé avec NodeJS, Express et MongoDb"
        }

        let searchTerm = req.body.searchTerm;

        console.log(searchTerm);
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")


        // Utilisez searchTerm pour rechercher des posts correspondant.
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, "i")}},
                { body: { $regex: new RegExp(searchNoSpecialChar, "i")}}
            ]
        });

        res.render("search", {
            data,
            locals
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

});


router.get("/post/:id", async (req, res) => {

    try {

        let id = req.params.id;

        const data = await Post.findById(id);

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJS, Express & MongoDb",
            currentRoute: `/post/${id}`
        }

        if (!data) {
            return res.status(404).send('Post not found');
        }

        res.render("post", { locals, data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/about", (req, res) => {
    //render pour toute une page au lieu de mots
    res.render("about", {
        currentRoute: "/about"
    });
});

// function insertPostData () {
//     Post.insertMany([
//             {
//                 title: "NodeJS Blog",
//             description: "Simple Blog created with NodeJS, Express & MongoDb"
//             }
//     ])
// }

// insertPostData();

//L'exportation pour que l'app fonctionne
module.exports = router;
