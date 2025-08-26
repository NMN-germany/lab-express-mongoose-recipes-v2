const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
//import the model
const RecipeModel = require( "./models/Recipe.model.js");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
    .connect(MONGODB_URI)
    .then((x) => console.log(`Connected to Mongo! Databese name: "${x.connections[0].name}`))
    .catch((error) => console.log("Error connecting to mongo", error));


// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", async (req, res) => {
    console.log("the post route");
    try {
        const newRecipe = await RecipeModel.create(req.body)
        return res.status(201).json({ msg: "Recipe created successfully", newRecipe});
    } catch (error) {
        console.log(error)
        return res.status(500).json("Failed to create a new recipe");
    }
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get("/recipes", async (req, res) => {
    try {
        const allRecipes = await RecipeModel.find();
        res.json(allRecipes);
    } catch (error) {
        res.status(500).json({ msg: "Failed to get recipes", error});
    }    
});


//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get("/recipes/:recipeId", async (req, res) => {
    try {
        console.log('the params', req.params)
        const oneRecipe = await RecipeModel.findById(req.params.recipeId);

        if (!recipe) return res.status(404).json({ msg: "Recipe not found" });
        res.status(200).json(oneRecipe);
  } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Failed to get recipe", error});
    }    
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put("/recipes/:recipeId", async (req, res) => {
    try {
        const updatedRecipe = await RecipeModel.findByIdAndUpdate(
            req.params.recipeId, 
            req.body,
            { new: true}
        );
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Failed to update the recipe" });
    }
})


//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete("/recipes/:recipeId", async (req, res) => {
    const theRecipeId = req.params.recipeId
    try {
        const deletedRecipe = await RecipeModel.findByIdAndDelete(theRecipeId)
        return res.status(204).json({ msg: "Recipe successfully deleted", deletedRecipe}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Failed to delete the recipe"});
    }
})


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
