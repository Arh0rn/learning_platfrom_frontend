// src/pages/TaskPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getTopicTask,
    executeTask,
    resetTask,
    submitTaskSolution,
} from "../api/courses";
import {
    Container,
    Typography,
    CircularProgress,
    Button,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import Editor from "@monaco-editor/react";

const TaskPage = () => {
    const { id: courseId, topicId, order } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    // Editor code
    const [code, setCode] = useState("");

    // Execution output
    const [executionOutput, setExecutionOutput] = useState("");
    const [executing, setExecuting] = useState(false);

    // Submission status (for the color-coded box)
    const [submitting, setSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    // Snackbar states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    // Helper to open the Snackbar with a given message & severity
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    // Close handler for the Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const data = await getTopicTask(courseId, topicId, order);
                if (!data?.id) throw new Error("Task missing 'id' (UUID).");

                // Decode double-escaped newlines/tabs
                let decoded = data.starter_code || "";
                decoded = decoded
                    .replace(/\\n/g, "\n")
                    .replace(/\\t/g, "\t")
                    .replace(/\\"/g, '"');

                setTask(data);
                setCode(decoded);
            } catch (err) {
                console.error("Error loading task:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [courseId, topicId, order]);

    // Execute
    const handleExecute = async () => {
        if (!task?.id) {
            showSnackbar("No valid task.id", "error");
            return;
        }
        setExecuting(true);
        setExecutionOutput("");
        try {
            const result = await executeTask(courseId, topicId, task.id, code);
            setExecutionOutput(result.output || "No output");
        } catch (err) {
            console.error("Execute error:", err);
            setExecutionOutput(`Error: ${err.message}`);
        } finally {
            setExecuting(false);
        }
    };

    // Submit (color-coded box for success/failure)
    const handleSubmit = async () => {
        if (!task?.id) return;
        setSubmitting(true);
        setSubmissionResult(null); // Clear old message
        try {
            await submitTaskSolution(courseId, topicId, task.id, code);

            setSubmissionResult({
                status: "success",
                message: "Submission successful!",
            });
        } catch (err) {
            console.error("Submit error:", err);
            setSubmissionResult({
                status: "error",
                message: "Submission failed.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Reset (now uses Snackbar)
    const handleReset = async () => {
        if (!task?.id) {
            showSnackbar("No valid task.id", "error");
            return;
        }
        if (!window.confirm("Reset this task to its original code?")) return;

        try {
            await resetTask(courseId, topicId, task.id);

            // Re-fetch
            const fresh = await getTopicTask(courseId, topicId, order);
            let decoded = fresh.starter_code || "";
            decoded = decoded
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\"/g, '"');

            setTask(fresh);
            setCode(decoded);
            setExecutionOutput("");
            setSubmissionResult(null);
            showSnackbar("Task reset to original code.", "success");
        } catch (err) {
            console.error("Reset error:", err);
            showSnackbar("Reset failed.", "error");
        }
    };

    if (loading) {
        return <CircularProgress />;
    }
    if (!task) {
        return <Typography>Task not found.</Typography>;
    }

    // Color-coded submission box (above the editor)
    const submissionBox = submissionResult && (
        <Box
            sx={{
                my: 2,
                p: 2,
                borderRadius: 2,
                color: "white",
                backgroundColor:
                    submissionResult.status === "success" ? "green" : "red",
            }}
        >
            <Typography>{submissionResult.message}</Typography>
        </Box>
    );

    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                {task.title || `Task #${order}`}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {task.description}
            </Typography>

            {/* Show submission status box if any */}
            {submissionBox}

            <Editor
                height="300px"
                defaultLanguage="go"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val ?? "")}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExecute}
                    disabled={executing}
                >
                    {executing ? "Running..." : "Execute"}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </Box>

            {/* Execution Output */}
            <Box
                sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                    minHeight: 80,
                }}
            >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Execution Output:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {executionOutput}
                </Typography>
            </Box>

            {/* The MUI Snackbar + Alert */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default TaskPage;
