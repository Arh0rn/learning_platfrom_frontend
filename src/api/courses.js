/**
 * ------------------------------------------------------------------
 * courses.js
 * ------------------------------------------------------------------
 *
 * This file manages all "courses" domain logic:
 *   - Getting course catalog, single course by ID
 *   - Fetching course categories
 *   - Enrolling in a course
 *   - Getting topic content / quizzes
 *   - Submitting quizzes, resetting quizzes
 *   - Getting tasks, submitting task solutions
 *
 * Each function maps closely to the relevant endpoint in your Swagger.
 */

import api from "./axiosInstance";

/**
 * POST /courses
 * Body: { categories_ids, limit, offset }
 *
 * Fetches a list of courses for the "catalog" view.
 * Returns an array of courses on success.
 */
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
        // The backend returns { courses: [...] }
        return response.data.courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

/**
 * GET /courses/{course_id}
 *
 * Fetch detailed info about a single course, including topics.
 * Returns an object of the form:
 * {
 *   course: { id, title, description, ... },
 *   topics: [{ id, title, ... }, ...]
 * }
 */
export const getCourseById = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course ${courseId}:`, error);
        throw error;
    }
};

/**
 * GET /courses/categories
 *
 * Fetches a list of course categories.
 * Returns an array: [ { id: string, name: string, ... }, ... ]
 */
export const getCourseCategories = async () => {
    try {
        const response = await api.get("/courses/categories");
        return response.data.categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

/**
 * POST /courses/enroll
 * Body: { course_id }
 *
 * Enrolls the current user into a course, if not already enrolled.
 * Typically returns { status: "success" } or some success object.
 */
export const enrollToCourse = async (courseId) => {
    try {
        console.log("Отправка на сервер:", courseId);
        const response = await api.post("/courses/enroll", {
            course_id: courseId,
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

/**
 * GET /courses/{course_id}/topic/{topic_id}/content
 *
 * Fetches the textual (and video/images) content for a given topic
 * within a course. Returns:
 * {
 *   id: string,
 *   content: string,
 *   video_urls: [...],
 *   image_urls: [...],
 *   additional_resources: [...]
 * }
 */
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

/**
 * GET /courses/{course_id}/topic/{topic_id}/quizzes
 *
 * Fetch a list of quizzes for the specified topic, plus an indicator
 * if the quiz was already passed (passed: boolean).
 * Returns something like { quizzes: [...], passed: boolean } or
 * directly "quizzes" if you've nested into .data.
 *
 */
// In your courses.js or wherever:
// If your backend returns { quizzes: [...], passed: bool },
// plus each quiz has an "answers" field when passed, do this:
export const getTopicQuizzes = async (courseId, topicId) => {
    try {
        const response = await api.get(
            `/courses/${courseId}/topic/${topicId}/quizzes`
        );
        // Return the entire object, e.g. { quizzes: [...], passed: bool }
        return response.data;
    } catch (error) {
        console.error(`Error fetching quizzes for topic ${topicId}:`, error);
        throw error;
    }
};

/**
 * POST /courses/{course_id}/topic/{topic_id}/quiz/submit
 * Body: { answers: [{ question_id, answer: [bool, bool, ...] }, ...] }
 *
 * Submits the user's quiz answers for grading.
 * Returns a result object, e.g. { status: "success" } or
 * possibly correct/incorrect stats, depending on your backend.
 */
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

/**
 * POST or PUT /courses/{course_id}/topic/{topic_id}/quiz/reset
 *
 * Resets the quiz for a topic so the user can retake it.
 * In the Swagger, it shows a PUT method:
 *    PUT /courses/{course_id}/topic/{topic_id}/quiz/reset
 *
 * But in your code, you do a POST. Adjust if the backend requires PUT.
 */
export const resetQuiz = async (courseId, topicId) => {
    try {
        // If your server truly requires PUT, do:
        // const response = await api.put(`/courses/${courseId}/topic/${topicId}/quiz/reset`);
        const response = await api.put(
            `/courses/${courseId}/topic/${topicId}/quiz/reset`
        );
        return response.data;
    } catch (error) {
        console.error(`Error resetting quiz for topic ${topicId}:`, error);
        throw error;
    }
};

/**
 * GET /courses/{courseId}/topic/{topicId}/tasks/{order}
 * Returns a task with an "id" (UUID) and "starter_code",
 * which may look like "package main\\n\\nimport (\\n\\t\"fmt\"\\n) ..."
 */
export const getTopicTask = async (courseId, topicId, order) => {
    const response = await api.get(
        `/courses/${courseId}/topic/${topicId}/tasks/${order}`
    );
    return response.data;
};

/**
 * Execute code:
 * POST /courses/{courseId}/topic/{topicId}/task/{taskId}/execute
 * Body: { input: codeAsIs }
 */
export const executeTask = async (courseId, topicId, taskId, code) => {
    // Send the code as-is. JSON.stringify will produce single \n, \t, etc.
    const response = await api.post(
        `/courses/${courseId}/topic/${topicId}/task/${taskId}/execute`,
        { input: code }
    );
    return response.data;
};

/**
 * Reset the user's progress:
 * DELETE /courses/{courseId}/topic/{topicId}/task/{taskId}/reset
 */
export const resetTask = async (courseId, topicId, taskId) => {
    const response = await api.delete(
        `/courses/${courseId}/topic/${topicId}/task/${taskId}/reset`
    );
    return response.data;
};

/**
 * Submit final solution:
 * POST /courses/{courseId}/topic/{topicId}/task/{taskId}/submit
 * Body: { input: codeAsIs }
 */
export const submitTaskSolution = async (courseId, topicId, taskId, code) => {
    const response = await api.post(
        `/courses/${courseId}/topic/${topicId}/task/${taskId}/submit`,
        { input: code }
    );
    return response.data;
};

/* ------------------------------------------------------------------
   OPTIONAL EXTRA ENDPOINTS (if you want them in this same file):
   - getUserEnrollments
   - executeTask
   - resetTask
------------------------------------------------------------------ */

/**
 * GET /courses/enrollments
 *
 * Retrieves the authenticated user's enrollments.
 * Returns: { enrollments: [ { id, course: {...}, status, ... }, ... ] }
 */
export const getUserEnrollments = async () => {
    try {
        const response = await api.get("/courses/enrollments");
        return response.data.enrollments;
    } catch (error) {
        console.error("Error fetching user enrollments:", error);
        throw error;
    }
};
