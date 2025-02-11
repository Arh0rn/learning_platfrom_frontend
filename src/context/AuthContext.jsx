import { createContext, useContext, useState, useEffect } from "react";
import { login, refresh, confirmRegister } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(
        () => localStorage.getItem("access_token") || null
    );
    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem("refresh_token") || null
    );
    const [loading, setLoading] = useState(true); // Новая переменная, чтобы избежать зацикливания

    useEffect(() => {
        if (!token || !refreshToken) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const response = await refresh(refreshToken);
                const { access_token, refresh_token } = response.data;

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                setToken(access_token);
                setRefreshToken(refresh_token);

                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const response = await login(email, password);
            const { access_token, refresh_token } = response.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify({ email }));

            setToken(access_token);
            setRefreshToken(refresh_token);
            setUser({ email });
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed.");
        }
    };

    const handleConfirmRegister = async (email, code) => {
        try {
            const response = await confirmRegister(email, code);
            const { access_token, refresh_token } = response.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify({ email }));

            setToken(access_token);
            setRefreshToken(refresh_token);
            setUser({ email });
        } catch (error) {}
    };

    const logout = () => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider
            value={{ user, token, handleLogin, handleConfirmRegister, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
