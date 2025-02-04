import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmPage from "./pages/ConfirmPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ConfirmResetPage from "./pages/ConfirmResetPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/confirm-reset" element={<ConfirmResetPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
