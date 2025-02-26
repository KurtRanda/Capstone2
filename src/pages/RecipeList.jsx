import React, { useEffect, useState } from "react";
import { getSavedRecipes } from "../api/backend";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [searchIngredient, setSearchIngredient] = useState(""); // ✅ Ingredient filter state
  const [filteredRecipes, setFilteredRecipes] = useState([]); // ✅ Recipes that match the filter

  useEffect(() => {
    async function fetchData() {
      const data = await getSavedRecipes();
      setRecipes(data);
      setFilteredRecipes(data); // ✅ Initially, show all recipes
    }
    fetchData();
  }, []);

  // ✅ Filter recipes when searchIngredient changes
  useEffect(() => {
    if (searchIngredient.trim() === "") {
      setFilteredRecipes(recipes); // Show all if search is empty
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchIngredient.toLowerCase())
        )
      );
      setFilteredRecipes(filtered);
    }
  }, [searchIngredient, recipes]);

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

      <ul>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <li key={recipe.id}>
              <h3>{recipe.name}</h3>
              <img src={recipe.image_url} alt={recipe.name} width="100" />
              <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            </li>
          ))
        ) : (
          <p>No recipes found with that ingredient.</p>
        )}
      </ul>
    </div>
  );
}

export default RecipeList;

