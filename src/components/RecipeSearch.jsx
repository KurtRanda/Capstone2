import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchRecipes } from "../api/edamam";
import { saveRecipe } from "../api/backend";
import "../App.css"; // Ensure styles are applied

function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const results = await searchRecipes(query);
    console.log("API Response from Edamam:", results);  // ✅ Log the full API response
    setRecipes(results);
  };

  const handleSave = async (recipe) => {
    await saveRecipe(recipe);
    alert("Recipe saved!");
  };

  return (
    <div className="recipe-search-container">
      <h2>Find Recipes</h2>
      <input
        type="text"
        placeholder="Enter ingredients (comma-separated)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="recipe-grid">
        {recipes.map((recipeData, index) => {
          const recipe = recipeData.recipe;
          console.log("Recipe being sent to Details Page:", recipe); // ✅ Debugging

          return (
            <div className="recipe-card" key={index}>
              <img src={recipe.image} alt={recipe.label} />
              <h3>{recipe.label}</h3>
              <p><strong>Calories:</strong> {Math.round(recipe.calories)}</p>
              <p><strong>Servings:</strong> {recipe.yield}</p>
              
              {/* ✅ FIXED: Passing the correct recipe object */}
              <Link to={`/recipe/${index}`} state={{ recipe }}> 
                <button>View Details</button>
              </Link>

              <button onClick={() => handleSave(recipe)}>Save Recipe</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecipeSearch;


