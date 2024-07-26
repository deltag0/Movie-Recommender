const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const path = require("path");
const http = require('http');
var engine = require('consolidate');
const ejs = require('ejs');
const mustache = require('mustache');
const fs = require('fs');
const db = require("./config/dbConnection.js");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
db();
app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(express.json());

app.use("/home/users", require("./routes/users"));
app.use("/home/user", require("./routes/accounts.js"));


app.get("/home/login", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "./views/loginPage.html"));
});
app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});



