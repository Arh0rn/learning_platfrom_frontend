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

// Helper to format date strings
function formatDate(dateString) {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString; // fallback if invalid
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

/**
 * Returns author's name if it exists (non-empty),
 * otherwise returns author's email, or "unknown" if neither is present
 */
function getDisplayName(author) {
    if (!author) return "unknown";
    const maybeName = author.name?.trim();
    if (maybeName) return maybeName;
    return author.email || "unknown";
}

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

                const fetchedAnswers = await getAnswers(id, 50, 0); // up to 50 answers
                // Sort newest first
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
            await postAnswer({ question_id: id, body: newAnswer });
            // After successful post, re-fetch answers
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

    const questionAuthorName = getDisplayName(question.author);

    return (
        <Box>
            {/* Question Section */}
            <Typography variant="h5" gutterBottom>
                {question.title}
            </Typography>

            {/* Show the image if provided */}
            {question.image_url && (
                <Box sx={{ my: 2, textAlign: "center" }}>
                    <img
                        src={question.image_url}
                        alt={question.title}
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                </Box>
            )}

            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {question.body}
            </Typography>

            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Asked by: {questionAuthorName} on{" "}
                {formatDate(question.created_at)}
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
                    {answers.map((ans) => {
                        const answerAuthor = getDisplayName(ans.author);
                        return (
                            <ListItem key={ans.id} alignItems="flex-start">
                                <ListItemText
                                    primary={ans.body}
                                    secondary={
                                        <Box
                                            component="span"
                                            sx={{
                                                color: "gray",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            by {answerAuthor} at{" "}
                                            {formatDate(ans.created_at)}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        );
                    })}
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
