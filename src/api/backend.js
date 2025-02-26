import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export async function getSavedRecipes() {
  try {
    const res = await axios.get(`${API_URL}/recipes`);
    return res.data;
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    return [];
  }
}

export async function saveRecipe(recipe) {
  try {
    const res = await axios.post(`${API_URL}/recipes`, {
      user_id: 1, // Replace with actual user ID
      recipe_id: recipe.uri.split("_")[1],
      name: recipe.label,
      image_url: recipe.image,
      source_url: recipe.url,
      calories: recipe.calories,
      servings: recipe.yield,
    });
    return res.data;
  } catch (err) {
    console.error("Error saving recipe:", err);
  }
}
