import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import "./App.css"; // ✅ Import global styles
import RecipeList from "./pages/RecipeList";
import GroceryList from "./pages/GroceryList.jsx"; 
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipePage from "./pages/RecipePage.jsx";
import RecipeDetails from "./pages/RecipeDetails";
import RecipeResults from "./pages/RecipeResults";

/**
 * App Component
 *
 * The main entry point for the application. It handles:
 * - **User Authentication State** → `user` is passed to components requiring authentication.
 * - **Routing Management** → Uses React Router to navigate between pages.
 * - **Navigation Bar** → The Navbar component updates dynamically based on user state.
 */
function App() {
  const [user, setUser] = useState(null); // ✅ Stores logged-in user information

  return (
    <Router>
      {/* ✅ Global Navigation Bar (Passes user state to Navbar) */}
      <Navbar user={user} setUser={setUser} />

      {/* ✅ Define Routes for Application Navigation */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Home Page */}
        <Route path="/recipes" element={<RecipePage />} /> {/* ✅ Recipe Search Page */}
        <Route path="/recipe-results" element={<RecipeResults user={user} />} /> {/* ✅ Recipe Search Results */}
        <Route path="/recipe/:id" element={<RecipeDetails user={user} />} /> {/* ✅ Recipe Details */}
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* ✅ Login Page */}
        <Route path="/signup" element={<Signup />} /> {/* ✅ Signup Page */}
        <Route path="/saved-recipes" element={<RecipeList user={user} />} /> {/* ✅ Saved Recipes */}
        <Route path="/grocery-list" element={<GroceryList user={user} />} /> {/* ✅ Grocery List */}
      </Routes>
    </Router>
  );
}

export default App;

