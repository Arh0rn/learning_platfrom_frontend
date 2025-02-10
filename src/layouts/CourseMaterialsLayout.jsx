import { Box } from "@mui/material";
import SemiHeader from "../components/SemiHeader";
import Sidebar from "../components/Sidebar";
import { Outlet, useParams } from "react-router-dom";
import sampleCourse from "../samples/course.json"; // Sample data for now

const CourseMaterialsLayout = () => {
    const { id } = useParams();
    const course = sampleCourse.id === id ? sampleCourse : null;

    if (!course) return <p>Course not found</p>;

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <SemiHeader courseTitle={course.title} />
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
