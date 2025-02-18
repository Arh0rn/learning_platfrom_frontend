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
} from "@mui/material";
import Editor from "@monaco-editor/react";

// Our new "radical" function
import { encodeCodeForRequest } from "../utils/encodeCodeForRequest";

const TaskPage = () => {
    const { id: courseId, topicId, order } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState("");
    const [executionOutput, setExecutionOutput] = useState("");
    const [executing, setExecuting] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // 1) On mount, fetch the real task
        const fetchTask = async () => {
            setLoading(true);
            try {
                const data = await getTopicTask(courseId, topicId, order);
                if (!data?.id) throw new Error("Task missing 'id' (UUID).");

                // If the server returns something like "package main\\n\\n..."
                // You might decode it so the editor sees real lines/tabs:
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

    const handleExecute = async () => {
        if (!task?.id) {
            alert("No valid task.id");
            return;
        }
        setExecuting(true);
        setExecutionOutput("");
        try {
            // 2) Convert real newlines/tabs => literal "\n" / "\t" (double slash)
            const finalCode = encodeCodeForRequest(code);

            // Then pass finalCode to your API call
            const result = await executeTask(
                courseId,
                topicId,
                task.id,
                finalCode
            );
            setExecutionOutput(result.output || "No output");
        } catch (err) {
            console.error("Execute error:", err);
            setExecutionOutput(`Error: ${err.message}`);
        } finally {
            setExecuting(false);
        }
    };

    const handleSubmit = async () => {
        if (!task?.id) return;
        setSubmitting(true);
        try {
            const finalCode = encodeCodeForRequest(code);
            await submitTaskSolution(courseId, topicId, task.id, finalCode);
            alert("Solution submitted successfully!");
        } catch (err) {
            console.error("Submit error:", err);
            alert("Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = async () => {
        if (!task?.id) return;
        if (!window.confirm("Reset this task?")) return;
        try {
            // call reset
            await resetTask(courseId, topicId, task.id);
            // re-fetch
            const fresh = await getTopicTask(courseId, topicId, order);
            let decoded = fresh.starter_code || "";
            decoded = decoded
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\"/g, '"');

            setTask(fresh);
            setCode(decoded);
            setExecutionOutput("");
            alert("Task reset to original code.");
        } catch (err) {
            console.error("Reset error:", err);
            alert("Reset failed.");
        }
    };

    if (loading) return <CircularProgress />;
    if (!task) return <Typography>Task not found.</Typography>;

    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                {task.title || `Task #${order}`}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {task.description}
            </Typography>

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
        </Container>
    );
};

export default TaskPage;
