import { Container, Typography, Grid } from "@mui/material";
import CourseCard from "../components/CourseCard";
import courses from "../samples/courses.json"; // Import sample data

const CoursesPage = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                Available Courses
            </Typography>
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
        </Container>
    );
};

export default CoursesPage;
