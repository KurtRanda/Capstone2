import React from "react";
import { Link } from "react-router-dom";
import RecipeSearch from "../components/RecipeSearch";
import "../App.css"; // Ensure this is imported for styling

function Home() {
  return (
    <div className="home-container">
      {/* Background Overlay */}
      <div className="overlay">
        <h1 className="home-title">MealMatch: What’s in Your Kitchen? Let’s Cook!</h1>
        <h2 className="home-subtitle">
          No more wasted ingredients—get recipe ideas based on what you already have!
        </h2>
        
        {/* CTA Buttons */}
        <div className="home-buttons">
          <Link to="/recipes" className="btn primary-btn">Find Recipes</Link>
          <Link to="/grocery-list" className="btn secondary-btn">Manage Grocery List</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

                 