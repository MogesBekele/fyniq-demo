// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { describe, it, expect, vi, beforeEach } from "vitest";
// import StaffDashboard from "./StaffDashboard";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { MemoryRouter } from "react-router-dom";
// import { useAuth as mockUseAuth } from "../../context/AuthProvider";

// vi.mock("axios");

// vi.mock("react-toastify", () => ({
//   toast: {
//     error: vi.fn(),
//     success: vi.fn(),
//     info: vi.fn(),
//   },
// }));

// vi.mock("../../context/AuthProvider");
// mockUseAuth.mockImplementation(() => ({
//   logout: vi.fn(),
//   API_URL: "http://mock-api.com",
// }));

// delete window.location;
// window.location = { href: "" };

// const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

// describe("StaffDashboard", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     localStorage.setItem("auth", JSON.stringify({ username: "moges" }));
//   });

//   it("fetches and displays files on mount", async () => {
//     axios.get.mockResolvedValue({
//       data: [
//         {
//           _id: "1",
//           originalName: "file1.pdf", // must match what you assert
//           uploader: "moges",
//           uploadedAt: Date.now(),
//         },
//       ],
//     });

    
//     renderWithRouter(<StaffDashboard />);

//     // Wait for the file to appear
//     const fileName = await screen.findByText(/file1.pdf/i);
//     expect(fileName).toBeInTheDocument();
//     expect(screen.getByText(/moges/i)).toBeInTheDocument();
//   });

//   it("approves a file when Validate button is clicked", async () => {
//     axios.get.mockResolvedValue({
//       data: [
//         {
//           _id: "2",
//           originalName: "file2.pdf",
//           uploader: "alex",
//           uploadedAt: Date.now(),
//         },
//       ],
//     });

//     renderWithRouter(<StaffDashboard />);

//     const fileName = await screen.findByText(/file2.pdf/i);
//     expect(fileName).toBeInTheDocument();

//     const validateBtn = await screen.findByRole("button", {
//       name: /validate/i,
//     });
//     await userEvent.click(validateBtn);

//     await waitFor(() =>
//       expect(screen.getByText(/validated/i)).toBeInTheDocument()
//     );
//     expect(toast.success).toHaveBeenCalledWith("Validated");
//   });

//   it("rejects a file when Reject button is clicked", async () => {
//     axios.get.mockResolvedValue({
//       data: [
//         {
//           _id: "3",
//           originalName: "file3.pdf",
//           uploader: "john",
//           uploadedAt: Date.now(),
//         },
//       ],
//     });

//     renderWithRouter(<StaffDashboard />);

//     const fileName = await screen.findByText(/file3.pdf/i);
//     expect(fileName).toBeInTheDocument();

//     const rejectBtn = await screen.findByRole("button", { name: /reject/i });
//     await userEvent.click(rejectBtn);

//     await waitFor(() =>
//       expect(screen.getByText(/rejected/i)).toBeInTheDocument()
//     );
//     expect(toast.success).toHaveBeenCalledWith("Rejected");
//   });

//   it("logs out and clears localStorage", async () => {
//     axios.get.mockResolvedValue({ data: [] });

//     renderWithRouter(<StaffDashboard />);

//     const logoutBtn = await screen.findByRole("button", { name: /logout/i });
//     await userEvent.click(logoutBtn);

//     expect(localStorage.getItem("auth")).toBeNull();
//     expect(toast.info).toHaveBeenCalledWith("Logged out successfully");
//     expect(window.location.href).toBe("/");
//   });
// });
