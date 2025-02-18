// src/pages/forum/ForumQuestionPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionById, getAnswers, postAnswer } from "../../api/faq";
import {
    Box,
    Typography,
    Divider,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ForumQuestionPage = () => {
    const { id } = useParams(); // question ID
    const { user } = useAuth();

    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    // For posting an answer
    const [newAnswer, setNewAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedQuestion = await getQuestionById(id);
                setQuestion(fetchedQuestion);

                const fetchedAnswers = await getAnswers(id, 50, 0); // get up to 50 answers
                // If you want newest to appear first, sort:
                fetchedAnswers.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setAnswers(fetchedAnswers);
            } catch (error) {
                console.error("Error loading question or answers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handlePostAnswer = async () => {
        if (!user) {
            alert("You must be logged in to post an answer.");
            return;
        }
        if (!newAnswer.trim()) return;
        setSubmitting(true);

        try {
            await postAnswer({
                question_id: id,
                body: newAnswer,
            });
            // After successful post, re-fetch answers or just push it locally
            const updatedAnswers = await getAnswers(id, 50, 0);
            updatedAnswers.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setAnswers(updatedAnswers);
            setNewAnswer("");
        } catch (error) {
            console.error("Error posting answer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }
    if (!question) {
        return <Typography>Question not found.</Typography>;
    }

    return (
        <Box>
            {/* Question Section */}
            <Typography variant="h5" gutterBottom>
                {question.title}
            </Typography>

            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {question.body}
            </Typography>

            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Created at: {question.created_at}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Answers Section */}
            <Typography variant="h6" gutterBottom>
                Answers
            </Typography>

            {answers.length === 0 ? (
                <Typography>No answers yet. Be the first to answer!</Typography>
            ) : (
                <List>
                    {answers.map((ans) => (
                        <ListItem key={ans.id} alignItems="flex-start">
                            <ListItemText
                                primary={ans.body}
                                secondary={
                                    <>
                                        <Box
                                            component="span"
                                            sx={{
                                                color: "gray",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            by {ans.author?.email || "unknown"}{" "}
                                            at {ans.created_at}
                                        </Box>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Add Answer Form (only if logged in) */}
            {user ? (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Post your answer:
                    </Typography>
                    <TextField
                        multiline
                        minRows={3}
                        fullWidth
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Write your answer..."
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={handlePostAnswer}
                        disabled={submitting}
                    >
                        {submitting ? "Posting..." : "Submit Answer"}
                    </Button>
                </Box>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Log in to post an answer.
                </Typography>
            )}
        </Box>
    );
};

export default ForumQuestionPage;
