import { Box } from "@mui/material";
import SemiHeader from "../components/SemiHeader";
import Sidebar from "../components/Sidebar";
import { Outlet, useParams } from "react-router-dom"; // ❌ useEffect и useState не здесь!
import { useEffect, useState } from "react"; // ✅ Импортируем useEffect и useState из React
import { getCourseById } from "../api/courses";
import Header from "../components/Header";

const CourseMaterialsLayout = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id);
                setCourse(data);
            } catch (error) {
                console.error("Ошибка загрузки курса:", error);
            }
        };
        fetchCourse();
    }, [id]);

    if (!course) return <p>Загрузка...</p>;

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Header />
            <SemiHeader courseTitle={course.course.title} />
            <Box display="flex" flexGrow={1}>
                <Sidebar course={course} />
                <Box flexGrow={1} p={3}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default CourseMaterialsLayout;
