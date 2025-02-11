import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopicQuizzes, submitQuiz, resetQuiz } from "../api/courses";
import {
    Container,
    Typography,
    CircularProgress,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    Paper,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";

const QuizPage = () => {
    const { id, topicId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await getTopicQuizzes(id, topicId);
                setQuizzes(data);

                // Initialize state: all answers set to `false`
                setSelectedAnswers(
                    data.reduce((acc, quiz) => {
                        acc[quiz.id] = new Array(quiz.options.length).fill(
                            false
                        );
                        return acc;
                    }, {})
                );
            } catch (err) {
                showSnackbar("Ошибка загрузки квиза", "error");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [id, topicId]);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleAnswerChange = (questionId, optionIndex, multipleChoice) => {
        setSelectedAnswers((prev) => {
            const newAnswers = { ...prev };

            if (multipleChoice) {
                newAnswers[questionId][optionIndex] =
                    !newAnswers[questionId][optionIndex];
            } else {
                newAnswers[questionId] = new Array(
                    prev[questionId].length
                ).fill(false);
                newAnswers[questionId][optionIndex] = true;
            }

            return newAnswers;
        });
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            const formattedAnswers = quizzes.map((quiz) => ({
                question_id: quiz.id,
                answer: selectedAnswers[quiz.id],
            }));

            console.log(
                "Submitting quiz payload:",
                JSON.stringify(formattedAnswers, null, 2)
            );

            const response = await submitQuiz(id, topicId, formattedAnswers);
            showSnackbar(
                `✅ Тест отправлен! Статус: ${response.status}`,
                "success"
            );
        } catch (err) {
            showSnackbar(
                `❌ Ошибка: ${
                    err.response?.data?.error || "Неизвестная ошибка"
                }`,
                "error"
            );
            console.error("Ошибка отправки теста:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetQuiz(id, topicId);
            setSelectedAnswers(
                quizzes.reduce((acc, quiz) => {
                    acc[quiz.id] = new Array(quiz.options.length).fill(false);
                    return acc;
                }, {})
            );
            showSnackbar("🔄 Тест сброшен", "info");
        } catch (err) {
            showSnackbar("Ошибка сброса теста", "error");
            console.error("Ошибка сброса квиза:", err);
        }
    };

    if (loading) return <CircularProgress />;
    if (quizzes.length === 0)
        return <Typography>Квизы не найдены для этой темы.</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                📝 Тестирование
            </Typography>

            {quizzes.map((quiz) => (
                <Paper key={quiz.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">{quiz.question}</Typography>
                    {quiz.multiple_choice ? (
                        <FormGroup>
                            {quiz.options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            checked={
                                                selectedAnswers[quiz.id][index]
                                            }
                                            onChange={() =>
                                                handleAnswerChange(
                                                    quiz.id,
                                                    index,
                                                    true
                                                )
                                            }
                                        />
                                    }
                                    label={option}
                                />
                            ))}
                        </FormGroup>
                    ) : (
                        <RadioGroup
                            value={selectedAnswers[quiz.id].findIndex(
                                (v) => v === true
                            )}
                            onChange={(e) =>
                                handleAnswerChange(
                                    quiz.id,
                                    Number(e.target.value),
                                    false
                                )
                            }
                        >
                            {quiz.options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={index}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    )}
                </Paper>
            ))}

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Отправка..." : "📤 Отправить ответы"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                >
                    🔄 Сбросить тест
                </Button>
            </Box>

            {/* ✅ Всплывающее уведомление */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default QuizPage;
