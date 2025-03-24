import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import RecipeDetails from "../RecipeDetails";

const mockRecipe = {
  label: "Test Recipe",
  image: "https://via.placeholder.com/600",
  ingredientLines: ["1 cup flour", "2 eggs"],
};

test("renders RecipeDetails component", async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/recipe", state: { recipe: mockRecipe } }]}>
      <Routes>
        <Route path="/recipe" element={<RecipeDetails user={null} />} />
      </Routes>
    </MemoryRouter>
  );

  // ✅ Ensure the recipe label appears in the document
  await waitFor(() => {
    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();
  });

  expect(screen.getByRole("img", { name: /test recipe/i })).toBeInTheDocument();
});

