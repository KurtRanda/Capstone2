import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedRecipes } from "../api/backend";
import axios from "axios";

function RecipeList({ user }) { 
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchIngredient, setSearchIngredient] = useState(""); // ✅ Store search input
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      console.log("📥 Fetching saved recipes...");
      const data = await getSavedRecipes();
      setRecipes(data);
      setFilteredRecipes(data); // ✅ Initially, show all recipes
    }

    fetchData();
  }, []);

  // ✅ Update filtered recipes when the search query changes
  useEffect(() => {
    if (searchIngredient.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        (recipe.ingredients ? recipe.ingredients.split(", ") : []).some(ingredient =>
          ingredient.toLowerCase().includes(searchIngredient.toLowerCase())
        )
      );
      setFilteredRecipes(filtered);
    }
  }, [searchIngredient, recipes]);

  console.log("🔍 Filtered Recipes Data:", filteredRecipes);

  // ✅ Function to navigate to recipe details
  const handleRecipeClick = (recipe) => {
    console.log("📌 Navigating to RecipeDetails from saved recipes");

    const formattedRecipe = {
        uri: `http://www.edamam.com/ontologies/edamam.owl#recipe_${recipe.recipe_id}`,
        label: recipe.name,
        image: recipe.image_url,
        url: recipe.source_url,
        calories: recipe.calories,
        yield: recipe.servings,
        ingredientLines: recipe.ingredients ? recipe.ingredients.split(", ") : [],
    };

    navigate(`/recipe/${recipe.recipe_id}`, {
        state: { 
            recipe: formattedRecipe, 
            previousResults: recipes, 
            searchQuery: "",
            fromSavedRecipes: true // ✅ Pass this flag
        }
    });
};


  // ✅ Function to Remove a Recipe
  const handleRemoveRecipe = async (recipeId) => {
    if (!user || !user.id) { 
        alert("You need to log in to remove recipes!");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Authentication token missing! Please log in again.");
        return;
    }

    try {
        console.log("🛑 Attempting to remove recipe with ID:", recipeId);

        await axios.delete(`http://localhost:5000/recipes/${encodeURIComponent(recipeId)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setRecipes((prevRecipes) => prevRecipes.filter((r) => r.recipe_id !== recipeId));
        setFilteredRecipes((prevRecipes) => prevRecipes.filter((r) => r.recipe_id !== recipeId));
        alert("Recipe removed successfully!");
    } catch (error) {
        console.error("❌ Error removing recipe:", error.response?.data || error);
        alert("Failed to remove recipe.");
    }
  };

  return (
    <div>
      <h2>Saved Recipes</h2>

      {/* ✅ Search bar for filtering by ingredient */}
      <input
        type="text"
        placeholder="Search by ingredient..."
        value={searchIngredient}
        onChange={(e) => setSearchIngredient(e.target.value)}
      />

      {filteredRecipes.length === 0 ? (
        <p>No saved recipes found.</p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe, index) => (
            <div
              className="recipe-card"
              key={index}
              onClick={() => handleRecipeClick(recipe)}
              style={{
                cursor: "pointer",
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                borderRadius: "5px"
              }}
            >
              <img src={recipe.image_url} alt={recipe.name} style={{ width: "100px", height: "100px" }} />
              <h3>{recipe.name}</h3>
              <p>Calories: {recipe.calories}</p>

              {/* ✅ View Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecipeClick(recipe);
                }}
                style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
              >
                View Details
              </button>

              {/* ✅ Remove Recipe Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveRecipe(recipe.recipe_id);
                }}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  background: "red",
                  color: "white",
                  marginLeft: "10px"
                }}
              >
                Remove Recipe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;







