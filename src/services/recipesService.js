const Recipe = require("../models/Recipe");
const User = require("../models/User");

exports.getAll = () => Recipe.find(); 
exports.getOne = (recipeId) => Recipe.findById(recipeId).populate();

exports.getLatest = () => Recipe.find().sort({ createdAt: -1 }).limit(3);

exports.getOneDetailed = async (recipeId, userId) => {
    const recipe = await Recipe.findById(recipeId)
    .populate("owner")
    .populate("recommendList")
    .lean();
 
    const isRecommend = recipe.recommendList.some(recommend => recommend._id.equals(userId));
    
    return {...recipe, isRecommend };
 }

exports.create = async (userId, recipeData) => {
   const createdRecipe = await Recipe.create({
    owner: userId,
    ...recipeData,
   });

   await User.findByIdAndUpdate(userId, { $push: { createdRecipes: createdRecipe._id}});

   return createdRecipe;
};

exports.delete = (recipeId) => Recipe.findByIdAndDelete(recipeId);
exports.edit = (recipeId, recipeData) => Recipe.findByIdAndUpdate(recipeId, recipeData, { runValidators: true});