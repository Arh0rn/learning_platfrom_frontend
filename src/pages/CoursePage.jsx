import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    List,
    ListItem,
    CircularProgress,
} from "@mui/material";
import { getCourseById } from "../api/courses";

const CoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCourseById(id)
            .then((data) => {
                setCourse(data);
                setLoading(false);
            })
            .catch(() => {
                navigate("/courses");
            });
    }, [id, navigate]);

    if (loading) return <CircularProgress />;
    if (!course) return null;

    return (
        <Container maxWidth="md">
            <Card>
                <CardMedia
                    component="img"
                    height="250"
                    image={
                        course.image_url ||
                        "https://via.placeholder.com/600x250"
                    }
                    alt={course.title}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {course.description}
                    </Typography>

                    <Typography variant="h5" sx={{ mt: 2 }}>
                        Topics:
                    </Typography>
                    <List>
                        {course.topics.map((topic) => (
                            <ListItem key={topic.id}>
                                <Typography variant="body1">
                                    • {topic.title}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={() =>
                            navigate(`/course/${course.id}/materials`)
                        }
                    >
                        Start Course
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CoursePage;
