import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroceryList from "../GroceryList";
import { vi } from "vitest";
import api from "../../api/api"; 

// ✅ Mock the `api` module, NOT `axios`
vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() } }, // ✅ Mock interceptors
  },
}));

describe("GroceryList Component", () => {
  const mockUser = { id: "test-user", email: "test@example.com" };

  beforeEach(() => {
    // ✅ Use `api.get`, NOT `axios.get`
    api.get.mockResolvedValue({
      data: [{ id: 1, ingredient_name: "Tomatoes", quantity: "2", unit: "pcs", purchased: false }],
    });
  });

  test("renders grocery list with items", async () => {
    render(<GroceryList user={mockUser} />);

    expect(screen.getByText(/Your Grocery List 🛒/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();
    });
  });

  test("removes an item when 'Remove' button is clicked", async () => {
    api.delete.mockResolvedValue({}); // ✅ Mock `api.delete`

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
    api.get.mockResolvedValue({ data: [] }); // ✅ Mock empty grocery list

    render(<GroceryList user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/Your list is empty!/i)).toBeInTheDocument();
    });
  });
});
