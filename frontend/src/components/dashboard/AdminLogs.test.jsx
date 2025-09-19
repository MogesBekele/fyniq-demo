import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { useAuth as mockUseAuth } from "../../context/AuthProvider";
import AdminLogs from "./LogsDashboard";

// Mock axios
vi.mock("axios", () => ({
  default: { get: vi.fn() },
}));

// Mock useAuth
vi.mock("../../context/AuthProvider");
mockUseAuth.mockImplementation(() => ({
  API_URL: "http://mock-api.com",
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("AdminLogs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner initially", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(<AdminLogs />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/No logs available/i)).toBeInTheDocument()
    );
  });

  it("shows no logs message when API returns empty array", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(<AdminLogs />);

    await waitFor(() =>
      expect(screen.getByText(/No logs available/i)).toBeInTheDocument()
    );
  });

  it("renders logs correctly when API returns data", async () => {
    const mockLogs = [
      {
        _id: "1",
        action: "validated",
        file: "file1.pdf",
        user: "moges",
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        action: "rejected",
        file: "file2.pdf",
        user: "alex",
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockLogs });

    renderWithRouter(<AdminLogs />);

    // Wait for async render
   expect(await screen.findByText(/validated/i)).toBeInTheDocument(); // ✅ works

    expect(screen.getByText(/file1\.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/moges/i)).toBeInTheDocument();

    expect(screen.getByText(/rejected/i)).toBeInTheDocument();
    expect(screen.getByText(/file2\.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/alex/i)).toBeInTheDocument();
  });

  it("navigates back when Back button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(<AdminLogs />);

    const backBtn = await screen.findByRole("button", { name: /back/i });
    await userEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/staff");
  });
});
