const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    uri: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    image: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    recipeData: {
        difficulty: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
        },
        yield: {
            type: String,
            required: true,
        },
        preparationTime: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
        },
        cockingTime: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
        }
    },
    specialNeeds: {
        type: [String],
        required: true,
    },
    nutritionalInfo: {
        totalKcal: {
            type: String,
            required: true,
        },
        fat: {
            kcal: { type: String, required: true },
            gr: { type: String, required: true },
            porcentage: { type: String, required: true }
        },
        carbohydrates: {
            kcal: { type: String, required: true },
            gr: { type: String, required: true },
            porcentage: { type: String, required: true }
        },
        protein: {
            kcal: { type: String, required: true },
            gr: { type: String, required: true },
            porcentage: { type: String, required: true }
        },
        additionalInfo: {
            sugars: { type: String, required: true },
            fiber: { type: String, required: true },
            saturatedFats: { type: String, required: true },
            salt: { type: String, required: true }
        }
    },
    yieldPerAge: {
        adult: { type: String, required: true },
        threeToEight: { type: String, required: true },
        nineToTwelve: { type: String, required: true },
        teen: { type: String, required: true }
    },
    ingredientLines: {
        type: [String],
        required: true
    },
    directions: {
        type: [String],
        required: true
    },
    chefTips: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: true
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
