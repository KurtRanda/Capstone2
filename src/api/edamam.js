import axios from "axios";

const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

console.log("Edamam API ID:", APP_ID);
console.log("Edamam API Key:", APP_KEY);


export async function searchRecipes(query) {
  try {
    const res = await axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    return res.data.hits;
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return [];
  }
}
