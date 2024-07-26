const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel");
const express = require("express");
const bodyParser = require("body-parser");
const mustache = require('mustache');
const path = require("path");
var engine = require('consolidate');
const http = require('http');
const util = require("util");
const cookieParser = require('cookie-parser');
const { findOne } = require("../models/userModel");
const User = require("../models/userModel");
const MovieList = require("../models/movieListModel");
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

appAccounts = express();
appAccounts.use(express.json());
appAccounts.use(cookieParser());
appAccounts.set('views', __dirname + '/views');
appAccounts.engine('html', engine.mustache);
appAccounts.set('view engine', 'html');
appAccounts.use(bodyParser.urlencoded({ extended: true }));


const getOneFavourite = asyncHandler(async (req, res) => {
    const movies = await Movie.findById(req.params.id);
    if (!contacts) {
        res.status(400);
        throw new Error("Movie not found");
    }
    res.json(movies);
});

const homePage = asyncHandler (async (req, res) => {
    res.render(path.join("userpage.html"), {name: req.cookies['username']});
});


const getFavourites = asyncHandler(async (req, res) => {
    console.log("HERE")
    res.render(path.join("userpage.html"),);
});

const find_view = asyncHandler (async (req, res) => {
    res.render(path.join("find_view.html"), {name: req.cookies['username']});
})


const addFavorite = asyncHandler(async (req, res) => {
    console.log(`The request body is`, req.body)
    const {name, categories} = req.body;
    if (!name || !categories || !rating) {
        res.status(400);
        throw new Error("Some fields are empty");
    }
    const movie = await Movie.create ({
        name,
        categories,
        rating
    });
    res.status(201).json(movie);
});

const updateMovie = asyncHandler (async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        res.status(400);
        throw new Error("Movie does not exist");
    }
    const updatedMovie = await Movie.findByIdAndUpdate (
        req.params.id,
        req.body,
        {new : true}
    )
    res.json(movie);
});

const find = asyncHandler (async (req, res) => {
    console.log('here')
    const spawn = require("child_process").spawn;
    const preferences = req.body.preferences;
    const process = spawn('python.exe',["C:\\Users\\ioan1\\Movie\\scripts\\search.py", preferences]);
    const email = req.cookies["email"];
    const user = await User.findOne({email});

    console.log('reading')
    let output;
    process.stdout.on("data", (data) => {
        console.log("FIRST OUT");
        movies = data.toString().replace(/'/g, "").slice(1).replace(/]/, "");
        movies = movies.split(",");
        console.log(movies)
        
        
    });
    process.stderr.on("data", (data) => {
        console.log("Error");
   });
   process.on("exit", (code) => {
    console.log("out");
    console.log(email);
    res.render(path.join("found_view.html"), {arr: movies, name: req.cookies['username']});
   })

})

const found = asyncHandler (async (req, res) => {
    res.render(path.join("found_view.html"), {name: req.cookies['username']});
})

const deleteMovie = asyncHandler (async (req, res) => {
    const movie = Movie.findById(req.params.id);
    if (!movie) {
        res.status(400);
        throw new Error("Movie does not exist");
    }
    res.status(200).json(movie);
    await Movie.deleteOne();
});

module.exports = {getOneFavourite, getFavourites, addFavorite, 
    updateMovie, deleteMovie, homePage, find_view, find,
    found};