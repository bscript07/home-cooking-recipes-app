const router = require("express").Router();

const { isAuth } = require("../middleware/authMiddleware");
const { getErrorMessage } = require("../utils/errorUtils");
const recipesService = require('../services/recipesService');
const Recipe = require("../models/Recipe");

router.get("/", async (req, res) => {
    const recipes = await recipesService.getAll().lean();

    res.render("recipes/catalog", { recipes }); // => test with empty array if dont have post in database
});

router.get("/:recipeId/details", async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user?._id;

    const recipe = await recipesService.getOneDetailed(recipeId, userId);
    const isOwner = recipe.owner && recipe.owner._id.equals(req.user?._id);
    const recommendCount = recipe.recommendList.length;

    res.render("recipes/details", { ...recipe, isOwner,  recommendCount});
});

router.get("/:recipeId/recommend-handler", async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user?._id;
    
    const recipe = await Recipe.findById(recipeId);

    recipe.recommendList.push(userId);
    await recipe.save();

    res.redirect(`/recipes/${recipeId}/details`);
});

router.get("/create", isAuth, (req, res) => {
    res.render("recipes/create");
});

router.post("/create", isAuth, async (req, res) => {
    const recipeData = req.body;

    try {
        await recipesService.create(req.user._id, recipeData);

        res.redirect("/recipes");
    } catch (err) {
        res.render("recipes/create", { ...recipeData, error: getErrorMessage(err) });
    }
});

router.get("/:recipeId/edit", isRecipeOwner, async (req, res) => {
    res.render("recipes/edit", { ...req.recipe });
});

router.post("/:recipeId/edit", isRecipeOwner, async (req, res) => {

    const recipeData = req.body;

    try {
        await recipesService.edit(req.params.recipeId, recipeData);

        res.redirect(`/recipes/${req.params.recipeId}/details`);
    } catch (err) {
        res.render("recipes/edit", { ...recipeData, error: getErrorMessage(err)});
    }
});

router.get("/:recipeId/delete", isRecipeOwner, async (req, res) => {
    
    await recipesService.delete(req.params.recipeId);

    res.redirect("/recipes");
});

async function isRecipeOwner(req, res, next) {
    const recipe = await recipesService.getOne(req.params.recipeId).lean();

    if (recipe.owner != req.user?._id) {
        return res.redirect(`/recipes/${req.params.recipeId}/details`);
    }

    req.recipe = recipe;
    next();
} 

module.exports = router;