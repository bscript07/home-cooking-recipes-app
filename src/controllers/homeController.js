const router = require("express").Router();
const recipesService = require("../services/recipesService");
const Recipe = require("../models/Recipe");
router.get("/", async (req, res) => {

    const latestRecipes = await recipesService.getLatest().lean();

    res.render("home", { latestRecipes }); // => test with empty array if dont have recipes in database
});

router.get("/search", async (req, res) => {
    const title = req.query.title || "";
    const recipes = await Recipe.find({ title: { $regex: title, $options: "i" },}).lean();

    res.render("search", { recipes });
});


module.exports = router;