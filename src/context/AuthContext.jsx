import { createContext, useContext, useState, useEffect } from "react";
import { login, refresh, confirmRegister } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  useEffect(() => {
    if (token) {
      refresh(token)
        .then((res) => {
          const { access_token, refresh_token } = res.data;
          setToken(access_token);
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
        })
        .catch(() => logout());
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      const { access_token, refresh_token } = response.data;
  
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
  
      setToken(access_token);
      setUser({ email });
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Login failed.");
      } else {
        throw new Error("Server error. Please try again later.");
      }
    }
  };
  

  const handleConfirmRegister = async (email, code) => {
    try {
      const response = await confirmRegister(email, code);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setToken(access_token);
      setUser({ email });
    } catch (error) {
      console.error("Confirmation failed", error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login"; // Перенаправляем на страницу входа
  };
  

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleConfirmRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
