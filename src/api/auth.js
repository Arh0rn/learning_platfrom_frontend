import api from "./axiosInstance";

export const login = async (email, password) => {
    return api.post("/auth/login", { email, password });
};

export const register = async (email, password, passwordConfirm) => {
    return api.post("/auth/register", {
        email,
        password,
        password_confirm: passwordConfirm,
    });
};

export const confirmRegister = async (email, code) => {
    return api.post("/auth/confirm", { email, code });
};

export const refresh = async (refreshToken) => {
    return api.post("/auth/refresh", { refresh_token: refreshToken });
};

export const resetPassword = async (email, password, passwordConfirm) => {
    return api.post("/auth/reset_password", {
        email,
        password,
        password_confirm: passwordConfirm,
    });
};

export const confirmResetPassword = async (email, code) => {
    return api.post("/auth/confirm_reset_password", { email, code });
};
