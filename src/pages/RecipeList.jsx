import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedRecipes } from "../api/backend"; // ✅ API call to fetch saved recipes
import axios from "axios";

/**
 * RecipeList Component
 * 
 * This component displays a user's saved recipes and provides functionality to:
 * - Search through saved recipes by filtering based on ingredients.
 * - Navigate to the detailed view of a selected recipe.
 * - Remove a saved recipe from the database.
 */
function RecipeList({ user }) { 
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]); // ✅ Stores all saved recipes
  const [searchIngredient, setSearchIngredient] = useState(""); // ✅ Stores user input for filtering
  const [filteredRecipes, setFilteredRecipes] = useState([]); // ✅ Stores filtered results based on search

  /**
   * Fetch saved recipes from the backend when the component mounts.
   */
  useEffect(() => {
    async function fetchData() {
      console.log("📥 Fetching saved recipes...");
      const data = await getSavedRecipes();
      setRecipes(data);
      setFilteredRecipes(data); // ✅ Initially, show all recipes
    }
    fetchData();
  }, []);

  /**
   * Update the filtered recipes when the search input changes.
   */
  useEffect(() => {
    if (searchIngredient.trim() === "") {
      setFilteredRecipes(recipes); // ✅ Reset to all recipes if search is empty
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

  /**
   * Navigate to Recipe Details Page
   * Formats the selected recipe's data and navigates to the RecipeDetails page.
   */
  const handleRecipeClick = (recipe) => {
    console.log("📌 Navigating to RecipeDetails from saved recipes");

    // ✅ Format recipe to match API response structure
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
            fromSavedRecipes: true // ✅ Indicates user is coming from saved recipes
        }
    });
  };

  /**
   * Remove a Saved Recipe
   * Sends a DELETE request to remove the recipe from the database and updates state.
   */
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

        // ✅ Update state by filtering out removed recipe
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
              {/* ✅ Recipe Image */}
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







