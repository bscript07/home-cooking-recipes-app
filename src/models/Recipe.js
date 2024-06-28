const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 2,
        required: [true, "Title is required!"],
    },
    ingredients: {
        type: String,
        minLength: 10,
        maxLength: 200,
        required: [true, "Ingredients is required!"],
    },
    instructions: {
        type: String,
        minLength: 10,
        required: [true, "Instructions is required!"],
    },
    description: {
        type: String,
        minLength: 10,
        maxLength: 100,
        required: [true, "Description is required!"],
    },
    image: {
        type: String,
        match: /^https?:\/\//,
        required: [true, "Image is required!"],
    },

    recommendList: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],

    createdAt: {
        type: Date,
        default: Date.now,
    },

    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;

