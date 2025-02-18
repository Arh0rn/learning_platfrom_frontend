/**
 * ------------------------------------------------------------------
 * axiosInstance.js
 * ------------------------------------------------------------------
 *
 * This file creates a single Axios instance with:
 *   1) A base URL (API_URL),
 *   2) Request interceptor to attach 'Bearer <token>',
 *   3) Response interceptor to refresh the token on 401 errors.
 *
 * All other API modules import and use this pre-configured `api`
 * instead of creating their own.
 */

import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://localhost:8081/api/v1";

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: API_URL,
});

/**
 * ------------------------------------------------------------------
 * REQUEST INTERCEPTOR
 *
 * Automatically attach the access token in the Authorization header
 * for every request, if it's present in localStorage.
 * ------------------------------------------------------------------
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * ------------------------------------------------------------------
 * RESPONSE INTERCEPTOR
 *
 * If a request returns 401 (Unauthorized) and we have a refresh token,
 * we try to fetch a new access token. If successful, we retry the
 * original request with the new access token.
 *
 * If refresh fails (e.g., invalid refresh token), we remove tokens
 * from localStorage and redirect the user to /auth (login).
 * ------------------------------------------------------------------
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_URL}/auth/refresh`,
                        {
                            refresh_token: refreshToken,
                        }
                    );
                    // Save the new access token
                    localStorage.setItem(
                        "access_token",
                        response.data.access_token
                    );

                    // Update the original request's Authorization header
                    error.config.headers.Authorization = `Bearer ${response.data.access_token}`;

                    // Retry the original request
                    return axios(error.config);
                } catch (refreshError) {
                    console.error("Token refresh failed", refreshError);
                    // If refresh fails, remove tokens and redirect to login
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/auth";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
