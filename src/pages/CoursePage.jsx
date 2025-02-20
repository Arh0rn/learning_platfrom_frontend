import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    getCourseById,
    enrollToCourse,
    getUserEnrollments,
} from "../api/courses";

const CoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        // 1) Load the course data
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id);
                setCourseData(data);

                // Store first topic in localStorage
                if (data.topics.length > 0) {
                    localStorage.setItem("firstTopicId", data.topics[0].id);
                }
                localStorage.setItem("currentCourse", JSON.stringify(data));
            } catch (err) {
                setError("Ошибка загрузки курса");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // 2) Check if user is enrolled in this course
        const checkEnrollment = async () => {
            try {
                const enrollments = await getUserEnrollments();
                const enrolled = enrollments.some((en) => en.course?.id === id);
                setIsEnrolled(enrolled);
            } catch (err) {
                console.error("Failed to check enrollment:", err);
            }
        };

        fetchCourse();
        checkEnrollment();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await enrollToCourse(id);
            setIsEnrolled(true); // now they’re enrolled
            redirectToFirstTopic();
        } catch (err) {
            console.error("Ошибка при записи на курс:", err);
        }
    };

    const redirectToFirstTopic = () => {
        const firstTopicId = localStorage.getItem("firstTopicId");
        if (firstTopicId) {
            navigate(`/course/${id}/materials/topic/${firstTopicId}/content`);
        } else {
            console.error("Ошибка: не найден ID первой темы.");
        }
    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!courseData || !courseData.course) {
        return <Typography>Курс не найден</Typography>;
    }

    const { course, topics = [] } = courseData;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom>
                {course.title}
            </Typography>

            {course.image_url && (
                <Box
                    component="img"
                    src={course.image_url}
                    alt={course.title}
                    sx={{
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: 2,
                        mb: 2,
                    }}
                />
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Description</Typography>
                    <Typography variant="body1">
                        {course.description}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Category</Typography>
                    <Typography variant="body2">
                        {course.category?.name || "Unknown"}
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Created At
                    </Typography>
                    <Typography variant="body2">
                        {course.created_at
                            ? new Date(course.created_at).toLocaleDateString()
                            : "Unknown"}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Course topics</Typography>
                    {topics.length > 0 ? (
                        <List>
                            {topics.map((topic, index) => (
                                <div key={topic.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${index + 1}. ${
                                                topic.title
                                            }`}
                                            secondary={topic.description}
                                        />
                                    </ListItem>
                                    {index < topics.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No topic added
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Box sx={{ display: "flex", gap: 2 }}>
                {/* Conditionally show the button based on enrollment status */}
                {!isEnrolled ? (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleEnroll}
                    >
                        Enroll to
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={redirectToFirstTopic}
                    >
                        Go to Materials
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default CoursePage;
