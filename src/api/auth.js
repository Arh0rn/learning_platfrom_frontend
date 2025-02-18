/**
 * ------------------------------------------------------------------
 * auth.js
 * ------------------------------------------------------------------
 *
 * This file contains authentication-related API calls:
 *   - login
 *   - register
 *   - confirmRegister
 *   - refresh
 *   - resetPassword
 *   - confirmResetPassword
 *
 * These map to the /auth/* endpoints in your Swagger.
 */

import api from "./axiosInstance";

/**
 * POST /auth/login
 * Body: { email, password }
 *
 * Logs user in using email & password and returns:
 * { access_token, refresh_token }
 */
export const login = async (email, password) => {
    return api.post("/auth/login", { email, password });
};

/**
 * POST /auth/register
 * Body: { email, password, password_confirm }
 *
 * Registers a new user and sends them a confirmation code by email.
 * The response is typically { status: "success" } on success.
 */
export const register = async (email, password, passwordConfirm) => {
    return api.post("/auth/register", {
        email,
        password,
        password_confirm: passwordConfirm,
    });
};

/**
 * POST /auth/confirm
 * Body: { email, code }
 *
 * Confirms the registration by sending the code that was emailed
 * to the user. If successful, returns tokens:
 * { access_token, refresh_token }
 */
export const confirmRegister = async (email, code) => {
    return api.post("/auth/confirm", { email, code });
};

/**
 * POST /auth/refresh
 * Body: { refresh_token }
 *
 * Exchanges a valid refresh token for a new access token.
 * Typically returns { access_token, refresh_token }.
 */
export const refresh = async (refreshToken) => {
    return api.post("/auth/refresh", { refresh_token: refreshToken });
};

/**
 * POST /auth/reset_password
 * Body: { email, password, password_confirm }
 *
 * Initiates a password reset flow by sending a confirmation code
 * to the user's email. Response is often { status: "success" }.
 */
export const resetPassword = async (email, password, passwordConfirm) => {
    return api.post("/auth/reset_password", {
        email,
        password,
        password_confirm: passwordConfirm,
    });
};

/**
 * POST /auth/confirm_reset_password
 * Body: { email, code }
 *
 * Confirms the user's password reset using the code they received.
 * If successful, the password is changed.
 * Response is typically { status: "success" }.
 */
export const confirmResetPassword = async (email, code) => {
    return api.post("/auth/confirm_reset_password", { email, code });
};
