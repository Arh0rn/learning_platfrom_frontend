import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import sampleCourse from "../samples/course.json";

const QuizPage = () => {
    const { topicId } = useParams();
    const topic = sampleCourse.topics.find((t) => t.id === topicId);

    if (!topic) return <p>Quiz not found</p>;

    return (
        <Container>
            <Typography variant="h4">Quiz: {topic.title}</Typography>
            {topic.quizzes.map((quiz) => (
                <Typography key={quiz.id} variant="body1">
                    {quiz.question}
                </Typography>
            ))}
        </Container>
    );
};

export default QuizPage;
