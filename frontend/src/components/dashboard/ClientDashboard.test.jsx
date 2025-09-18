import { toast } from "react-toastify";
import { vi } from "vitest";

//mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
