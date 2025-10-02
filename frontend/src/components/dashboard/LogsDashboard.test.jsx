import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import AdminLogs from "./LogsDashboard";

// Mock axios
vi.mock("axios", () => ({
  default: { get: vi.fn() },
}));

// Mock useAuth
vi.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({ API_URL: "http://mock-api.com" }),
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
    const now = new Date();
    const mockLogs = [
      {
        _id: "1",
        action: "validate",
        file: "file1.pdf",
        user: "moges",
        timestamp: now.toISOString(),
        createdAt: now.toISOString(),
      },
      {
        _id: "2",
        action: "reject",
        file: "file2.pdf",
        user: "alex",
        timestamp: now.toISOString(),
        createdAt: now.toISOString(),
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockLogs });

    renderWithRouter(<AdminLogs />);

    // Wait for all matching actions to appear
    const validateRows = await screen.findAllByText(/validate/i);
    expect(validateRows.length).toBeGreaterThan(0);

    const rejectRows = await screen.findAllByText(/reject/i);
    expect(rejectRows.length).toBeGreaterThan(0);

    // Assert files and users
    const file1Elements = await screen.findAllByText(/file1\.pdf/i);
    expect(file1Elements.length).toBeGreaterThan(0);

    const file2Elements = await screen.findAllByText(/file2\.pdf/i);
    expect(file2Elements.length).toBeGreaterThan(0);

    const mogesElements = await screen.findAllByText(/moges/i);
    expect(mogesElements.length).toBeGreaterThan(0);

    const alexElements = await screen.findAllByText(/alex/i);
    expect(alexElements.length).toBeGreaterThan(0);
  });

  it("navigates back when Back button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(<AdminLogs />);

    const backBtn = await screen.findByRole("button", { name: /back/i });
    await userEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/staff");
  });
});
