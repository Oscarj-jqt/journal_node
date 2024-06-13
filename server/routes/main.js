const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { isActiveRoute } = require("../helpers/routeHelpers");

// On crée nos routes
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

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        // Conversion en nombre 
        const nextPage = parseInt(page) + 1
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render("index", { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage: null,
            currentRoute: "/accueil"
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
            section: data.section,
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





