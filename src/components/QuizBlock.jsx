import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopicQuizzes, submitQuiz } from "../api/courses";
import {
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";

const QuizBlock = () => {
    const { id, topicId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await getTopicQuizzes(id, topicId);
                setQuizzes(data);
            } catch (err) {
                setError("Ошибка загрузки тестов");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [id, topicId]);

    const handleChange = (questionId, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(
                ([questionId, answer]) => ({
                    question_id: questionId,
                    answer: [answer],
                })
            );
            await submitQuiz(id, topicId, formattedAnswers);
            alert("Тест отправлен!");
        } catch (err) {
            console.error("Ошибка отправки теста:", err);
        }
    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (quizzes.length === 0) return <Typography>Тесты не найдены</Typography>;

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Тесты по теме
                </Typography>
                {quizzes.map((quiz) => (
                    <div key={quiz.id}>
                        <Typography variant="body1">{quiz.question}</Typography>
                        {quiz.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={answers[quiz.id] === index}
                                        onChange={() =>
                                            handleChange(quiz.id, index)
                                        }
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </div>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                >
                    Отправить ответы
                </Button>
            </CardContent>
        </Card>
    );
};

export default QuizBlock;
