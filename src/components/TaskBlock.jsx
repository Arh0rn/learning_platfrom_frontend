import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopicTask } from "../api/courses";
import { Card, CardContent, Typography } from "@mui/material";

const TaskBlock = () => {
    const { id, topicId } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTopicTask(id, topicId, 1); // Получаем первую задачу
                setTask(data);
            } catch (err) {
                setError("Ошибка загрузки задания");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, topicId]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!task) return <Typography>Задание не найдено</Typography>;

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Практическое задание
                </Typography>
                <Typography variant="body1">{task.description}</Typography>
                <Typography variant="body2" color="textSecondary">
                    Уровень сложности: {task.difficulty_level}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default TaskBlock;
