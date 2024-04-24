const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/recipes', recipeController.getAllRecipes);

router.post('/addRecipe', recipeController.createRecipe);

router.post('/scrapeRecipe', recipeController.scrapeRecipe);

module.exports = router;