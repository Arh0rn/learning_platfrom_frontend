import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import sampleCourse from "../samples/course.json";

const ContentPage = () => {
    const { topicId } = useParams();
    const topic = sampleCourse.topics.find((t) => t.id === topicId);

    if (!topic) return <p>Topic not found</p>;

    return (
        <Container>
            <Typography variant="h4">{topic.title}</Typography>
            <Typography variant="body1">{topic.content.content}</Typography>
        </Container>
    );
};

export default ContentPage;
