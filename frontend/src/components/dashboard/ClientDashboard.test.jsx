import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, test } from "vitest";
import ClientDashboard from "./ClientDashboard";
import axios from "axios";
import { toast } from "react-toastify";


// --- Mocks ---
vi.mock("axios");

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({
    logout: vi.fn(),
    API_URL: "http://mock-api.com",
  }),
}));

describe("ClientDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("auth", JSON.stringify({ username: "moges" }));
  });

  it("fetches and displays files on mount", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ _id: "1", originalName: "file1.pdf" }],
    });

    render(<ClientDashboard />);

    expect(axios.get).toHaveBeenCalledWith("http://mock-api.com/api/files");

    await waitFor(() => {
      expect(screen.getByText(/file1.pdf/i)).toBeInTheDocument();
    });
  });

  test("deletes a file when delete button is clicked", async () => {
    // Arrange: mock GET so the component has something to render
    axios.get.mockResolvedValueOnce({
      data: [{ _id: "1", originalName: "some file name" }],
    });

    render(<ClientDashboard />);

    // Act: wait for the file to show up
    expect(await screen.findByText(/some file name/i)).toBeInTheDocument();

    // Find delete button
    const deleteBtn = await screen.findByRole("button", { name: /delete/i });

    // Mock delete request
    axios.delete.mockResolvedValueOnce({});

    // Click delete
    await userEvent.click(deleteBtn);

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining("1"),
      expect.objectContaining({
        data: { username: "moges" },
      })
    );
  });

  it("logs out and clears localStorage", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<ClientDashboard />);

    screen.debug(); // 👀 check what the logout button looks like
    const logoutBtn = await screen.findByRole("button", { name: /logout/i });
    await userEvent.click(logoutBtn);

    expect(localStorage.getItem("auth")).toBeNull();
    expect(toast.info).toHaveBeenCalledWith("Logged out successfully");
  });
});
