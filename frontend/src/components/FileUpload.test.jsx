import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import { toast } from "react-toastify";
import { vi, describe, test, beforeEach, expect } from "vitest";
import FileUpload from "./FileUpload";

// Mock axios
vi.mock("axios");

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock Auth context
vi.mock("../context/AuthProvider", () => ({
  useAuth: () => ({ API_URL: "http://localhost:4000" }),
}));

describe("FileUpload Component", () => {
  const mockUser = { username: "testuser", role: "staff" };

  beforeEach(() => {
    localStorage.setItem("auth", JSON.stringify(mockUser));
    vi.clearAllMocks();
  });

  test("renders input and button", () => {
    render(<FileUpload />);
    expect(screen.getByText(/Upload Your File/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  test("warns if no file selected", async () => {
    render(<FileUpload />);
    fireEvent.click(screen.getByRole("button", { name: /upload/i }));
    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith("Select a file first!");
    });
  });

  test("shows error on failed upload", async () => {
    const mockFile = new File(["hello"], "test.txt", { type: "text/plain" });

    axios.post.mockRejectedValue(new Error("Upload failed"));

    render(<FileUpload />);
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [mockFile] } });

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Upload failed ❌")
    );
  });
});
