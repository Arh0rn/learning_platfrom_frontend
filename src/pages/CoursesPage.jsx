import { useState, useEffect } from "react";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../api/courses";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCourses()
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load courses:", error);
                setLoading(false);
            });
    }, []);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                Available Courses
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <CourseCard
                                id={course.id}
                                title={course.title}
                                image_url={course.image_url}
                                description={course.description}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CoursesPage;
