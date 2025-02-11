import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopicTask } from "../api/courses";
import { Container, Typography, CircularProgress } from "@mui/material";

const TaskPage = () => {
    const { id, topicId } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTopicTask(id, topicId, 1);
                setTask(data);
            } catch (error) {
                console.error("Ошибка загрузки задания:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, topicId]);

    if (loading) return <CircularProgress />;
    if (!task) return <Typography>Задание не найдено</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {task.title}
            </Typography>
            <Typography variant="body1">{task.description}</Typography>
        </Container>
    );
};

export default TaskPage;
