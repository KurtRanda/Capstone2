import React from "react";
import { render, screen } from "@testing-library/react";
import RecipeDetails from "../../pages/RecipeDetails";
import { BrowserRouter } from "react-router-dom";

test("renders RecipeDetails component", () => {
    render(
        <BrowserRouter>
            <RecipeDetails user={null} />
        </BrowserRouter>
    );
    expect(screen.getByText(/loading recipe details/i)).toBeInTheDocument();
});
