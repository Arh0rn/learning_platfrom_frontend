import api from "./axiosInstance";

export const getCourses = async () => {
    const response = await api.post("courses", { limit: 20, offset: 0 });
    return response.data.courses;
};

export const getCourseById = async (courseId) => {
    const response = await api.get(`courses/${courseId}`);
    return response.data.course;
};
