import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import sampleCourse from "../samples/course.json";

const TaskPage = () => {
    const { topicId } = useParams();
    const topic = sampleCourse.topics.find((t) => t.id === topicId);

    if (!topic) return <p>Task not found</p>;

    return (
        <Container>
            <Typography variant="h4">Practical Task: {topic.title}</Typography>
            <Typography variant="body1">
                {topic.practical_tasks[0].description}
            </Typography>
        </Container>
    );
};

export default TaskPage;
