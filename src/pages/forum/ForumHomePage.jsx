// src/pages/forum/ForumHomePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestions } from "../../api/faq";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Button,
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
 * Displays the user name if non-empty,
 * otherwise the user email, or "unknown".
 */
function getDisplayName(author) {
    if (!author) return "unknown";
    const maybeName = author.name?.trim();
    if (maybeName) return maybeName;
    return author.email || "unknown";
}

const ForumHomePage = () => {
    const { catId } = useParams(); // undefined if /forum, else if /forum/category/:catId
    const navigate = useNavigate();
    const { user } = useAuth(); // to check if user is logged in

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                // If category not set, pass empty array for all
                const category_ids = catId ? [catId] : [];
                const data = await getQuestions({
                    category_ids,
                    limit: 50,
                    offset: 0,
                });

                // Sort client-side by created_at (descending)
                data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [catId]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <Typography variant="h5">
                    {catId ? "Questions by Category" : "All Questions"}
                </Typography>

                {/* Show "Ask a Question" button only if logged in */}
                {user && (
                    <Button
                        variant="contained"
                        onClick={() => navigate("/forum/ask")}
                    >
                        Ask a Question
                    </Button>
                )}
            </Box>

            {questions.length === 0 ? (
                <Typography>No questions found.</Typography>
            ) : (
                <List>
                    {questions.map((question) => {
                        const authorName = getDisplayName(question.author);
                        return (
                            <Box key={question.id}>
                                <ListItem
                                    button
                                    onClick={() =>
                                        navigate(
                                            `/forum/question/${question.id}`
                                        )
                                    }
                                >
                                    <ListItemText
                                        primary={question.title}
                                        secondary={
                                            <>
                                                <Box
                                                    component="span"
                                                    sx={{ fontSize: "0.9rem" }}
                                                >
                                                    {question.body.slice(0, 80)}
                                                    ...
                                                </Box>
                                                <br />
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: "gray",
                                                        fontSize: "0.8rem",
                                                    }}
                                                >
                                                    by {authorName} | Created
                                                    at:{" "}
                                                    {formatDate(
                                                        question.created_at
                                                    )}
                                                </Box>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};

export default ForumHomePage;
