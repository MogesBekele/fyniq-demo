import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthPage from "./LoginForm";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useAuth
const mockLogin = vi.fn();
const mockRegister = vi.fn();
vi.mock("../context/AuthProvider", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
    register: mockRegister,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
// Mock useNavigate but preserve MemoryRouter
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter, // preserve MemoryRouter
  };
});

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form by default", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
expect(screen.getByPlaceholderText("Enter your username")).toBeInTheDocument();
expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

test("toggles to register form", async () => {
  render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>
  );

  // Use string matcher instead of regex
  const toggleLink = screen.getByText("Don't have an account? Register");

  fireEvent.click(toggleLink);

  await waitFor(() => {
  expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});


  test("successful login calls login and navigates", async () => {
    mockLogin.mockResolvedValue({ username: "user", role: "client" });

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("user", "pass"));
    expect(toast.success).toHaveBeenCalledWith("Login successful");
    expect(mockNavigate).toHaveBeenCalledWith("/client", { replace: true });
  });

  test("failed login shows toast error", async () => {
    mockLogin.mockRejectedValue({ response: { data: { message: "Invalid" } } });

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid"));
  });

  test("successful register calls register and resets form", async () => {
    mockRegister.mockResolvedValue({ username: "newuser", role: "client" });

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    // toggle to register
    fireEvent.click(screen.getByText(/Don't have an account\? Register/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "staff" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith("newuser", "newpass", "staff")
    );
    expect(toast.success).toHaveBeenCalledWith("Registration successful");
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });
});
