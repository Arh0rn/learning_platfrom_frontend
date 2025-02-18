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
} from "@mui/material";

const ForumHomePage = () => {
    const { catId } = useParams(); // Will be undefined if we are at /forum, or set if /forum/category/:catId
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                // If category not set, pass empty array to get all
                const category_ids = catId ? [catId] : [];
                const data = await getQuestions({
                    category_ids,
                    limit: 50,
                    offset: 0,
                });

                // Sort client-side by created_at (descending),
                // so newest question is at the top:
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
            <Typography variant="h5" gutterBottom>
                {catId ? "Questions by Category" : "All Questions"}
            </Typography>

            {questions.length === 0 ? (
                <Typography>No questions found.</Typography>
            ) : (
                <List>
                    {questions.map((question) => (
                        <Box key={question.id}>
                            <ListItem
                                button
                                onClick={() =>
                                    navigate(`/forum/question/${question.id}`)
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
                                                {question.body.slice(0, 80)}...
                                            </Box>
                                            <br />
                                            <Box
                                                component="span"
                                                sx={{
                                                    color: "gray",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                Created at:{" "}
                                                {question.created_at}
                                            </Box>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </Box>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default ForumHomePage;
