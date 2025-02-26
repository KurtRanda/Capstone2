import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import "./App.css"
import RecipeList from "./pages/RecipeList";
import GroceryList from "./pages/GroceryList.jsx";  // ✅ Import Grocery List
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipePage from "./pages/RecipePage.jsx";
import RecipeDetails from "./pages/RecipeDetails";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/recipe/:id" element={<RecipeDetails user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/saved-recipes" element={<RecipeList />} />
        <Route path="/grocery-list" element={<GroceryList user={user} />} /> {/* ✅ Add Grocery List Route */}
      </Routes>
    </Router>
  );
}

export default App;

