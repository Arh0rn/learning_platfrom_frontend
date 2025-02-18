// src/pages/forum/AskQuestionPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { getFaqCategories, postQuestion } from "../../api/faq";
import { useAuth } from "../../context/AuthContext";

const AskQuestionPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Local form state
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // If user is not logged in, you could redirect or show a message
        if (!user) {
            alert("You must be logged in to ask a question.");
            navigate("/login");
            return;
        }

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const data = await getFaqCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim() || !categoryId) {
            alert("Please fill in the required fields.");
            return;
        }

        setSubmitting(true);
        try {
            await postQuestion({
                title,
                body,
                category_id: categoryId,
                image_url: imageUrl,
            });
            alert("Question posted successfully!");
            // Since the response doesn't return a new question ID,
            // we navigate back to /forum. If you want to load the question detail,
            // your backend must return the newly created question ID.
            navigate("/forum");
        } catch (error) {
            console.error("Error posting question:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Ask a New Question
            </Typography>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={categoryId}
                        label="Category"
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        {categories.map((cat) => (
                            <MenuItem value={cat.id} key={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                    label="Body"
                    variant="outlined"
                    fullWidth
                    required
                    multiline
                    minRows={4}
                    sx={{ mb: 2 }}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />

                <TextField
                    label="Image URL (optional)"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                >
                    {submitting ? "Posting..." : "Submit Question"}
                </Button>
            </form>
        </Box>
    );
};

export default AskQuestionPage;
