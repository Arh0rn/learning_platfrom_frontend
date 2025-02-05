import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
} from "@mui/material";

const CoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        // Temporary fetch from local JSON (will be replaced by real API)
        fetch("/samples/courses.json")
            .then((response) => response.json())
            .then((data) => {
                const foundCourse = data.find((c) => c.id === id);
                if (foundCourse) {
                    setCourse(foundCourse);
                } else {
                    navigate("/courses"); // Redirect if course is not found
                }
            })
            .catch((error) => console.error("Error loading course:", error));
    }, [id, navigate]);

    if (!course) return null; // Prevent rendering if course is not loaded

    return (
        <Container maxWidth="md">
            <Card>
                <CardMedia
                    component="img"
                    height="250"
                    image={
                        course.image_url ||
                        "https://via.placeholder.com/600x250"
                    } // Placeholder image
                    alt={course.title}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="body1">
                        {course.description}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/courses")}
                    >
                        Back to Courses
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CoursePage;
