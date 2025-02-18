import api from "./axiosInstance";

/**
 * Get your own profile
 * GET /users/me
 *
 * Requires Authorization header.
 * Response format:
 * {
 *   "user": {
 *       "id": "string",
 *       "email": "string",
 *       "name": "string",
 *       "last_name": "string",
 *       "role": 1, // or 0 for admin, depending on enum
 *       ...
 *   }
 * }
 */
export const getMyProfile = async () => {
    try {
        const response = await api.get("/users/me");
        return response.data.user;
    } catch (error) {
        console.error("Error fetching my profile:", error);
        throw error;
    }
};

/**
 * Update your own profile
 * PUT /users/update
 *
 * Requires Authorization header.
 * Example body:
 * {
 *   "name": "John",
 *   "last_name": "Doe"
 * }
 *
 * Response:
 * {
 *   "status": "success"
 * }
 */
export const updateMyProfile = async ({ name, last_name }) => {
    try {
        const requestBody = {
            name,
            last_name,
        };
        const response = await api.put("/users/update", requestBody);
        return response.data; // Typically { status: "success" }
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

/**
 * Delete your own profile
 * DELETE /users/me/delete
 *
 * Requires Authorization header.
 * This will remove your account entirely.
 *
 * Response:
 * {
 *   "status": "success"
 * }
 */
export const deleteMyProfile = async () => {
    try {
        const response = await api.delete("/users/me/delete");
        return response.data; // Typically { status: "success" }
    } catch (error) {
        console.error("Error deleting my profile:", error);
        throw error;
    }
};

/**
 * Get another user by ID (admin usage or if publicly allowed)
 * GET /users/{id}
 *
 * Example path: /users/abc123
 *
 * Response format:
 * {
 *   "user": {
 *       "id": "string",
 *       "email": "string",
 *       "name": "string",
 *       ...
 *   }
 * }
 */
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data.user;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};
