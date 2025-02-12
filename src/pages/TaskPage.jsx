import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopicTask, submitTaskSolution } from "../api/courses";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/go/go"; // Using Go language mode

const TaskPage = () => {
    const { id: courseId, topicId } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState(""); // Single editor for user code
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTopicTask(courseId, topicId, 1);
                if (!data?.id) throw new Error("Task ID is missing!");

                // Fix double quotes issue and properly format starter code
                const formattedCode = data.starter_code
                    ? data.starter_code
                          .replace(/\\n/g, "\n")
                          .replace(/""/g, '"') // Fix quotes
                    : "";

                setTask(data);
                setCode(formattedCode);
            } catch (error) {
                console.error("Ошибка загрузки задания:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [courseId, topicId]);

    const handleSubmit = async () => {
        if (!task?.id) {
            alert("Error: Task ID is missing!");
            return;
        }

        setSubmitting(true);
        try {
            await submitTaskSolution(courseId, topicId, task.id, code);
            alert("Solution submitted successfully!");
        } catch (error) {
            console.error("Ошибка отправки решения:", error);
            alert("Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (!task) return <Typography>Задание не найдено</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {task.title || "Задание"}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {task.description}
            </Typography>

            {/* Single Code Editor */}
            <CodeMirror
                value={code}
                options={{
                    mode: "go", // Use Go syntax
                    theme: "material",
                    lineNumbers: true,
                    tabSize: 4,
                    indentWithTabs: true,
                }}
                onBeforeChange={(editor, data, value) => setCode(value)}
            />

            {/* Submit Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ mt: 2 }}
            >
                {submitting ? "Submitting..." : "Submit Solution"}
            </Button>
        </Container>
    );
};

export default TaskPage;
