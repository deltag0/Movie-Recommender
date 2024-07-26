const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.cookies['token'];
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(400);
                throw new Error("User is not authorized");
            }
            req.decoded = decoded.user;
            next();
        });
        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }
    }
    else {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
});

module.exports = validateToken;