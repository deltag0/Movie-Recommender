const mongoose = require("mongoose");
const User = require("./userModel.js")
const movieSchema = new mongoose.Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Name of favorite movie"]
    },
    categories: {
        type: String,
        required: [true, "Categories the movie belongs to"]
    },
    rating: {
        type: Number,
        required: [true, "What would you rate the movie reccomended?"]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Movie", movieSchema);