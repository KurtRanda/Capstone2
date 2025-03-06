import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export const getSavedRecipes = async () => {
  const token = localStorage.getItem("token"); // ✅ Retrieve token
  if (!token) {
      console.error("❌ No authentication token found!");
      return [];
  }

  try {
      const response = await axios.get("http://localhost:5000/recipes", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
          withCredentials: true,
      });

      console.log("✅ Fetched saved recipes:", response.data);
      return response.data;
  } catch (error) {
      console.error("❌ Error fetching saved recipes:", error);
      return [];
  }
};

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
