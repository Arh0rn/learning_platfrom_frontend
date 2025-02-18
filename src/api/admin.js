import api from "./axiosInstance";

/**
 * Register an admin user
 * POST /admin/auth/register
 *
 * This will create an admin account and send a confirmation code.
 * Example body:
 * {
 *   "email": "admin@example.com",
 *   "password": "Password123",
 *   "password_confirm": "Password123"
 * }
 *
 * Response:
 * {
 *   "status": "success"
 * }
 */
export const registerAdmin = async (email, password, passwordConfirm) => {
    try {
        const response = await api.post("/admin/auth/register", {
            email,
            password,
            password_confirm: passwordConfirm,
        });
        return response.data; // Typically { status: "success" }
    } catch (error) {
        console.error("Error registering admin:", error);
        throw error;
    }
};

/**
 * Confirm admin registration
 * POST /admin/auth/confirm
 *
 * Example body:
 * {
 *   "email": "admin@example.com",
 *   "code": "123456"
 * }
 *
 * Response:
 * {
 *   "access_token": "string",
 *   "refresh_token": "string"
 * }
 */
export const confirmAdminRegister = async (email, code) => {
    try {
        const response = await api.post("/admin/auth/confirm", {
            email,
            code,
        });
        return response.data;
    } catch (error) {
        console.error("Error confirming admin registration:", error);
        throw error;
    }
};
