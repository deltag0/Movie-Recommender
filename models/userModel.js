const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        message: "Please enter your username"
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Account already exists with this email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    }

}, 
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);