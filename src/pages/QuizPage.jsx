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

    // The quizzes array
    const [quizzes, setQuizzes] = useState([]);
    // Whether the quiz is fully passed
    const [passed, setPassed] = useState(false);

    // Tracks user’s chosen answers for each quiz: { quizId: [bool, bool, ...], ... }
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Snackbar states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };
    const handleCloseSnackbar = () => setOpenSnackbar(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await getTopicQuizzes(id, topicId);
                // data => { quizzes: [...], passed: bool } (plus each quiz can have quiz.answers if passed)

                const quizArray = data.quizzes || [];
                setQuizzes(quizArray);
                setPassed(!!data.passed);

                // Build the default selectedAnswers
                // If passed => pre-fill with quiz.answers
                // If not passed => fill with all false
                const initialAnswers = {};
                quizArray.forEach((quiz) => {
                    if (data.passed && quiz.answers) {
                        initialAnswers[quiz.id] = quiz.answers;
                    } else {
                        initialAnswers[quiz.id] = new Array(
                            quiz.options.length
                        ).fill(false);
                    }
                });
                setSelectedAnswers(initialAnswers);
            } catch (err) {
                showSnackbar("Course load error", "error");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [id, topicId]);

    const handleAnswerChange = (questionId, optionIndex, multipleChoice) => {
        // If quiz is passed, we lock out changes
        if (passed) return;

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
                `✅ Test submitted, Status: ${response.status}`,
                "success"
            );
            // optionally re-fetch to see if now "passed"
        } catch (err) {
            showSnackbar(
                `❌ Error: ${err.response?.data?.error || "Unknown error"}`,
                "error"
            );
            console.error("Test submit error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetQuiz(id, topicId);

            // Show success message
            showSnackbar("🔄 Test reset", "info");

            // Reload the page to fully reset quiz state & remove the "passed" banner
            window.location.reload();
        } catch (err) {
            showSnackbar("Test reset error", "error");
            console.error("Quiz reset error:", err);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }
    if (quizzes.length === 0) {
        return <Typography>No quiz found.</Typography>;
    }

    // Show a green banner if quiz is passed
    let passedBanner = null;
    if (passed) {
        passedBanner = (
            <Box
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    color: "white",
                    backgroundColor: "green",
                }}
            >
                <Typography variant="h6" sx={{ m: 0 }}>
                    ✅ You have passed this quiz successfully!
                </Typography>
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                📝 Тестирование
            </Typography>

            {passedBanner}

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
                                                selectedAnswers[quiz.id]?.[
                                                    index
                                                ] || false
                                            }
                                            disabled={passed} // lock if passed
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
                            value={
                                selectedAnswers[quiz.id]?.findIndex(
                                    (v) => v === true
                                ) ?? -1
                            }
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
                                    control={<Radio disabled={passed} />}
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
                    {submitting ? "Submitting..." : "📤 Submit"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                >
                    🔄 Quiz reset
                </Button>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
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
