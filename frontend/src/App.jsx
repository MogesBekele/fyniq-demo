import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import LoginPage from "./pages/LoginPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import LogsDashboardPage from "./pages/LogsDashboardPage";

function App() {
  const ProtectedRoute = ({ children, role }) => {
    const storedUser = JSON.parse(localStorage.getItem("auth"));

    if (!storedUser) return <Navigate to="/" replace />; // not logged in
    if (role && storedUser.role !== role) return <Navigate to="/" replace />; // wrong role

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logs" element={<LogsDashboardPage />} />
        <Route
          path="/client"
          element={
            <ProtectedRoute role="client">
              <ClientDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">
              <StaffDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast container for global toast notifications */}
      <ToastContainer
        position="top-right" // where the toast appears
        autoClose={500} // all toasts disappear after 1.5s
        hideProgressBar={false} // show progress bar
        newestOnTop={true} // new toasts appear on top
        closeOnClick // close toast on click
        rtl={false} // left-to-right layout
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: "250px" }}
      />
    </Router>
  );
}

export default App;
