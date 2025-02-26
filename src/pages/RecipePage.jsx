import React, { useState } from "react";
import RecipeSearch from "../components/RecipeSearch";
import RecipeResults from "./RecipeResults";

function RecipePage() {
    const [recipes, setRecipes] = useState([]);

    return (
        <div>
            <h1>Find Your Perfect Recipe</h1>
            <RecipeSearch onRecipesFetched={setRecipes} />
            <RecipeResults recipes={recipes} />
        </div>
    );
}

export default RecipePage;
