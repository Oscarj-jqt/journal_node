require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers")
const path = require('path');
const app = express();
const PORT = 5000 || process.env.PORT;


// Connexion à la bdd 
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//pouvoir modifier l'article
app.use(methodOverride("_method"));

app.use(session({
    secret: "chat clavier",
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),
    //cookie: { maxAge: new Date (Date.now() + (3600000) ) }
    
}))

app.use(express.static(path.join(__dirname, 'public')));


//Templates Engine
app.use(expressLayout); 
app.set("layout", "./layouts/main");
//Noter rendu/pages sous format ejs
app.set("view engine",  "ejs");

app.locals.isActiveRoute = isActiveRoute;



app.set('views', path.join(__dirname, 'views'));



app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));


app.listen(PORT, () => {
    console.log(`L'app s'execute sur le port ${PORT}`);
})
