const Recipe = require('../models/recipeModel');

exports.checkRecipeExists = async (url) => {
   try {
       const existingRecipe = await Recipe.findOne({ uri: url }); // Aquí deberías buscar por la propiedad correcta de tu modelo, en este caso, parece que es 'uri' en lugar de 'url'
       if (existingRecipe) {
           return true;
       } else {
           return false;
       }
   } catch (err) {
         console.error('Error al buscar la receta:', err);
         throw err;
      }
};
