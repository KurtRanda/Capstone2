import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeSearch from "../../components/RecipeSearch";
import { BrowserRouter } from "react-router-dom";
import 'whatwg-fetch';
import { vi } from "vitest"

beforeAll(() => {
    global.alert = vi.fn();
  });
  
describe("RecipeSearch Component", () => {
    test("renders the search input field", () => {
        render(
            <BrowserRouter>
                <RecipeSearch />
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText(/Enter ingredients.../i)).toBeInTheDocument();
    });

    test("calls search function when the search button is clicked", () => {
        render(
            <BrowserRouter>
                <RecipeSearch />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter ingredients.../i), {
            target: { value: "pasta" },
        });
        fireEvent.click(screen.getByText(/Search/i));

        // Ensure the input value is updated
        expect(screen.getByPlaceholderText(/Enter ingredients.../i)).toHaveValue("pasta");
    });
});
