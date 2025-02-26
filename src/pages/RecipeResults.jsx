import React from "react";

function RecipeResults({ recipes }) {
    return (
        <div className="recipe-grid">
            {recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                recipes.map((recipeData, index) => {
                    const recipe = recipeData.recipe;
                    return (
                        <div className="recipe-card" key={index}>
                            <img src={recipe.image} alt={recipe.label} />
                            <h3>{recipe.label}</h3>
                            <p>Calories: {Math.round(recipe.calories)}</p>
                            <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                                View Recipe
                            </a>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default RecipeResults;
