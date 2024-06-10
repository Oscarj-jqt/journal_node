//Ce fichier sert aux routes du serveur pour les fonctionnalités de l'administrateur
//importation du framework
const express = require("express");
// utilisation pour définir des routes modulaires et gérables
const router = express.Router();
// importation des collections MongoDB
const Post = require("../models/Post");
const User = require("../models/User");
// utilisé pour le hashage des mots de passe
const bcrypt = require("bcrypt");
//
const jwt = require("jsonwebtoken");

// Les vues d'administration
const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

/**Check Login */

const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json( { message: "Non autorisé"} );
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error) {
        res.status(401).json( { message: "Non autorisé"} );
    }
}

/**GET
 * Page de connexion de l'administrateur
 */


router.get("/admin", async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJS, Express & MongoDb"
        }

        res.render("admin/index", { locals, layout: adminLayout});
    } catch (error) {
        console.log(error);
    }
});



//Traitement du formulaire de connexion

router.post("/admin", async (req, res) => {
    try {

        const { username, password } = req.body;
        
        const user = await User.findOne( { username } );

        if(!user) {
            return res.status(401).json( { message: "Informations d'identification invalides" } );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json( { message: "Informations d'identification invalides" } ); 
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/dashboard")
        // res.redirect("/admin")
          
    } catch (error) {
        console.log(error);
    }
});

/**GET
 * Tableau de bord de l'administrateur
 */

router.get("/dashboard", authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Panneau de configuration",
            description: "Simple Blog ..."
        }
    

        const data = await Post.find();
        res.render("admin/dashboard", {
            locals,
            data,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});



/**GET
 * Ajouter un nouvel article
 */

router.get("/add-post", authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Ajouter un article",
            description: "Simple Blog ..."
        }
    

        const data = await Post.find();
        res.render("admin/add-post", {
            locals,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});


/**
 * POST
 * Ajouter un nouvel article
 */


router.post("/add-post", authMiddleware, async (req, res) => {

    try {  
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }

});




/**GET
 * Modifier un article
 */

router.get("/edit-post/:id", authMiddleware, async (req, res) => {

    try {  

        const locals = {
            title: "Modifier l'article",
            description: "Free NodeJS User Management System",
        };


        const data = await Post.findOne({ _id: req.params.id });

        res.render("admin/edit-post", {
            locals,
            data,
            layout: adminLayout
        })

        

    } catch (error) {
        console.log(error);
    }
    
});






/**PUT
 * Modifier un article
 */

router.put("/edit-post/:id", authMiddleware, async (req, res) => {

    try {  
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
    
});





// router.post("/admin", async (req, res) => {
//     try {

//         const { username, password } = req.body;
        
//         if(req.body.username === "admin" && req.body.password === "password") {
//             res.send("Vous êtes connecté");
//         } else {
//             res.send("Mauvais pseudo ou mot de passe");
//         }
//         // res.redirect("/admin")
          
//     } catch (error) {
//         console.log(error);
//     }
// });


router.post("/register", async (req, res) => {
    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: "Utilisateur créé", user });
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            if (error.code === 11000) {
                return res.status(409).json({ message: "Utilisateur déjà en utilisation" });
            }
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }

        // res.redirect("/admin")
          
    } catch (error) {
        console.error('Erreur lors du hashage du mot de passe ou autre:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});






/**
 * DELETE
 * Admin - Supprimer un poste
 */

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect("/dashboard");
    }catch (error) {
        console.log(error);
    }

});



/**
 * DELETE
 * Déconnexion
 */



router.get("/logout", (req ,res) => {
    res.clearCookie("token");
    // res.json({ message: "Déconnexion réussie" });
    res.redirect("/");
});


module.exports = router;