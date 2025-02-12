import axios from "axios";

const API_URL = "https://api-golang-production-a90c.up.railway.app/api/v1";

const api = axios.create({
    baseURL: API_URL,
});

// Автоматически добавляем токен в заголовок запросов
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

// Автоматическое обновление токена при `401 Unauthorized`
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
                    localStorage.setItem(
                        "access_token",
                        response.data.access_token
                    );
                    error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
                    return axios(error.config); // Повторяем запрос
                } catch (refreshError) {
                    console.error("Token refresh failed", refreshError);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/auth"; // Перенаправление на страницу входа
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
