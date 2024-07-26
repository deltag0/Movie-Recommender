const express = require("express");
const appUser = express();
const User = require("../models/userModel");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const mustache = require('mustache');
const path = require("path");
var engine = require('consolidate');
const nodemailer = require("nodemailer");
const url = require("url");
const http = require('http');
const env = require('dotenv').config();
const cookieParser = require('cookie-parser');
appUser.use(cookieParser());
appUser.use(express.json());

appUser.set('views', __dirname + '/views');
appUser.engine('html', engine.mustache);
appUser.set('view engine', 'html');
appUser.use(bodyParser.urlencoded({ extended: true }));

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const reset_last = asyncHandler (async (req, res) => {
    console.log(req.cookies['id']);
    console.log(req.cookies['user_id']);
    if (req.cookies['id'] != null && req.cookies['user_id'] == req.cookies['id']) {
        console.log('here');
        const newPassword = req.body.password;
        const email = req.cookies['email']
        if (!newPassword){
            res.status(400);
            throw new Error("Enter a password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const userAvailable = await User.findOne({email});
        if (!userAvailable){
            res.status(400);
            throw new Error("User does not exist");
        }
        const user = await User.updateOne({
            password: hashedPassword,
        });
        if (user) {
            cookie = req.cookies;
            for (var prop in cookie) {
                if (!cookie.hasOwnProperty(prop)) {
                    continue;
                }    
                res.cookie(prop, '', {expires: new Date(0)});
            }
            console.log(`User created succesfully ${user}`);
            res.redirect(302, "/home/login");
        }
        else {
            throw new Error("An error has occured...");
        }
    }
    else {
        res.redirect(302, "/home/users/createNewPassword");
    }
})

const reset = asyncHandler (async (req, res) => {
    if (req.cookies['email'] != null) {
        const user_id = req.body.user_id;
        const id = req.cookies['id']
        if (id == user_id) {
            res.cookie('sent', false);
            res.cookie('good', true);
            res.cookie('user_id', user_id);
            res.redirect(302, "/home/users/reset_last");
        }
        else {
        
        }
    }
    else {
        res.redirect(302, "/home/users/createNewPassword");
    }
});

const createNew = asyncHandler (async (req, res) => {
    const userEmail = req.body.email;
    const id = makeid(5);
    const user = await User.findOne({email: userEmail});
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'ioan.1931@gmail.com',
          pass: process.env.GOOGLE_PASSWORD,
        }
      });
      const mailOptions = {
        from: String(process.env.EMAIL),
        to: userEmail,
        subject: 'Reset Password',
        text: 'Use this code to reset your password: ' + id,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      res.cookie('email', userEmail);
      res.cookie('id', id);
      res.cookie('sent', true);
      res.redirect(302, "/home/users/reset_password");
});

const register = asyncHandler (async (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.Password
    if (!username || !email || !password){
        res.status(400);
        throw new Error("All fields are required");
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable){
        res.status(400);
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })
    if (user){
        console.log(`User created succesfully ${user}`);
        res.redirect(302, "/home/login");
    }
    else{
        res.status(400);
        throw new Error("An error has occured");
    }
})

const login = asyncHandler (async (req, res) => {
    const email = req.body.email;
    const password = req.body.Password;

    if (!email || !password){
        res.status(400);
        throw new Error("Email or password not provided");
    }
    const user = await User.findOne({email});
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.id,
                email: user.email,
                id: user.id
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30m"});
        res.cookie('email', user.email);
        res.cookie('username', user.username);
        console.log(user.username)
        res.cookie('token', 'Bearer ' + accessToken);
        res.redirect(302, "/home/user/userpage/" + user.username);
    }
    else {
        res.status(400);
        throw new Error("Email or Password is not valid");
    }

});

const signupPage = asyncHandler (async (req, res) => {
    res.render(path.join("signUpPage.html"))
});

const createNew_view = asyncHandler (async (req, res) => {
    res.render(path.join("forgotPassword.html"));
});

const reset_view = asyncHandler (async (req, res) => {
    const check = req.cookies['sent'];
    if (check == 'true') {
        res.render(path.join("resetPassword.html"));
    }
    else {
        res.redirect(302, "/home/users/createNewPassword");
    }
});

const reset_view_last = asyncHandler (async (req, res) => {
    console.log(req.cookies['email']);
    if (req.cookies['email'] != null) {
        res.render(path.join("resetLast.html"));
    }
    else {
        res.redirect(302, "/home/users/createNewPassword");
    }
});

module.exports = {
    register,
    login,
    signupPage,
    createNew,
    reset,
    reset_last,
    createNew_view,
    reset_view,
    reset_view_last

};