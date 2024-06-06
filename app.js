require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const connectDB = require("./server/config/db");
const path = require('path');
const app = express();
const PORT = 5000 || process.env.PORT;


// Connexion à la bdd 
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


//Templates Engine
app.use(expressLayout); 
app.set("layout", "./layouts/main");
//Noter rendu/pages sous format ejs
app.set("view engine",  "ejs");
app.set('views', path.join(__dirname, 'views'));



app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
    console.log(`L'app s'execute sur le port ${PORT}`);
})
