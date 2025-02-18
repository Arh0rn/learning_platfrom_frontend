import { useState, useEffect } from "react";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import CourseCard from "../components/CourseCard";
import { getUserEnrollments } from "../api/courses";

const MyCoursesPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the authenticated user's enrollments
        getUserEnrollments()
            .then((data) => {
                setEnrollments(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load enrollments:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6" align="center">
                    Loading your courses...
                </Typography>
            </Container>
        );
    }

    // If there are no enrollments, we can display a friendly message
    if (!enrollments || enrollments.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6" align="center">
                    You have not enrolled in any courses yet.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                My Enrolled Courses
            </Typography>

            <Grid container spacing={3}>
                {enrollments.map((enrollment) => {
                    const { course } = enrollment;
                    // Each enrollment object has { course: {...}, status, ... }
                    return (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <CourseCard
                                id={course.id}
                                title={course.title}
                                image_url={course.image_url}
                                description={course.description}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default MyCoursesPage;
