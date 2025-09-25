import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StaffDashboard from "./StaffDashboard";
import axios from "axios";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import { useAuth as mockUseAuth } from "../../context/AuthProvider";

// Mock axios
vi.mock("axios");

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock useAuth
vi.mock("../../context/AuthProvider");
mockUseAuth.mockImplementation(() => ({
  logout: vi.fn(),
  API_URL: "http://mock-api.com",
}));

// Mock window.location
delete window.location;
window.location = { href: "" };

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("StaffDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("auth", JSON.stringify({ username: "moges" }));
  });

  it("fetches and displays files on mount", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          originalName: "file1.pdf",
          uploader: "moges",
          uploadedAt: "2025-09-18T12:00:00Z", // fixed ISO string
        },
      ],
    });

    renderWithRouter(<StaffDashboard />);

    // Wait for the table row containing file1.pdf
    const fileRow = await screen.findByRole("row", { name: /file1\.pdf/i });
    expect(fileRow).toBeInTheDocument();

    // Check uploader within that row
    expect(within(fileRow).getByText(/moges/i)).toBeInTheDocument();
  });

  it("approves a file when Validate button is clicked", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "2",
          originalName: "file2.pdf",
          uploader: "alex",
          uploadedAt: "2025-09-18T12:01:00Z",
        },
      ],
    });

    renderWithRouter(<StaffDashboard />);

    const fileRow = await screen.findByRole("row", { name: /file2\.pdf/i });
    expect(fileRow).toBeInTheDocument();
    expect(within(fileRow).getByText(/alex/i)).toBeInTheDocument();

    const validateBtn = within(fileRow).getByRole("button", {
      name: /validate/i,
    });
    await userEvent.click(validateBtn);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Validated")
    );
  });

  it("rejects a file when Reject button is clicked", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "3",
          originalName: "file3.pdf",
          uploader: "john",
          uploadedAt: "2025-09-18T12:02:00Z",
        },
      ],
    });

    renderWithRouter(<StaffDashboard />);

    const fileRow = await screen.findByRole("row", { name: /file3\.pdf/i });
    expect(fileRow).toBeInTheDocument();
    expect(within(fileRow).getByText(/john/i)).toBeInTheDocument();

    const rejectBtn = within(fileRow).getByRole("button", { name: /reject/i });
    await userEvent.click(rejectBtn);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Rejected"));
  });

  it("logs out and clears localStorage", async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<StaffDashboard />);

    const logoutBtn = await screen.findByRole("button", { name: /logout/i });
    await userEvent.click(logoutBtn);

    expect(localStorage.getItem("auth")).toBeNull();
    expect(toast.info).toHaveBeenCalledWith("Logged out successfully");
    expect(window.location.href).toBe("/");

  });
});
