import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroceryList from "../GroceryList";
import axios from "axios";

jest.mock("axios");

describe("GroceryList Component", () => {
  const mockUser = { id: "test-user", email: "test@example.com" };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ id: 1, ingredient_name: "Tomatoes", quantity: "2", unit: "pcs", purchased: false }] });
  });

  test("renders grocery list with items", async () => {
    render(<GroceryList user={mockUser} />);

    expect(screen.getByText(/Your Grocery List 🛒/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();
    });
  });

  test("removes an item when 'Remove' button is clicked", async () => {
    axios.delete.mockResolvedValue({}); // Mock successful delete response

    render(<GroceryList user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();
    });

    const removeButton = screen.getByRole("button", { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(/Tomatoes/i)).not.toBeInTheDocument();
    });
  });

  test("shows empty state message when no items exist", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Mock empty grocery list

    render(<GroceryList user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/Your list is empty!/i)).toBeInTheDocument();
    });
  });
});

