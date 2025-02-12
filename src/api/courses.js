import api from "./axiosInstance";

// Получение списка курсов (каталог)
export const getCourses = async ({
    categories_ids = [],
    limit = 10,
    offset = 0,
} = {}) => {
    try {
        const response = await api.post("/courses", {
            categories_ids,
            limit,
            offset,
        });
        return response.data.courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

// Получение детальной информации о курсе (с темами)
export const getCourseById = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course ${courseId}:`, error);
        throw error;
    }
};

// Получение категорий курсов
export const getCourseCategories = async () => {
    try {
        const response = await api.get("/courses/categories");
        return response.data.categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Запись пользователя на курс
// Запись пользователя на курс
export const enrollToCourse = async (courseId) => {
    try {
        console.log("Отправка на сервер:", courseId); // Проверяем ID перед запросом
        const response = await api.post("/courses/enroll", {
            course_id: courseId, // Убедимся, что тело передаётся правильно
        });
        return response.data;
    } catch (error) {
        console.error(
            `Ошибка при записи на курс ${courseId}:`,
            error.response?.data || error.message
        );
        throw error;
    }
};

// Получение контента по теме курса
export const getTopicContent = async (courseId, topicId) => {
    try {
        const response = await api.get(
            `/courses/${courseId}/topic/${topicId}/content`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching topic content ${topicId}:`, error);
        throw error;
    }
};

// Получение тестов по теме курса
export const getTopicQuizzes = async (courseId, topicId) => {
    try {
        const response = await api.get(
            `/courses/${courseId}/topic/${topicId}/quizzes`
        );
        return response.data.quizzes;
    } catch (error) {
        console.error(`Error fetching quizzes for topic ${topicId}:`, error);
        throw error;
    }
};

// Отправка ответа на тест
export const submitQuiz = async (courseId, topicId, answers) => {
    try {
        const response = await api.post(
            `/courses/${courseId}/topic/${topicId}/quiz/submit`,
            { answers }
        );
        return response.data;
    } catch (error) {
        console.error(`Error submitting quiz for topic ${topicId}:`, error);
        throw error;
    }
};

// Сброс теста
export const resetQuiz = async (courseId, topicId) => {
    try {
        const response = await api.post(
            `/courses/${courseId}/topic/${topicId}/quiz/reset`
        );
        return response.data;
    } catch (error) {
        console.error(`Error resetting quiz for topic ${topicId}:`, error);
        throw error;
    }
};

// Получение задания по теме курса
export const getTopicTask = async (courseId, topicId, order) => {
    try {
        const response = await api.get(
            `/courses/${courseId}/topic/${topicId}/tasks/${order}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching task ${order} for topic ${topicId}:`,
            error
        );
        throw error;
    }
};

export const submitTaskSolution = async (
    courseId,
    topicId,
    taskId,
    inputCode
) => {
    try {
        // Fix double quotes issue before sending
        const cleanCode = inputCode.replace(/""/g, '"');

        const response = await api.post(
            `/courses/${courseId}/topic/${topicId}/task/${taskId}/submit`,
            { input: cleanCode }
        );
        return response.data;
    } catch (error) {
        console.error(
            `Ошибка при отправке решения для задания ${taskId}:`,
            error
        );
        throw error;
    }
};
