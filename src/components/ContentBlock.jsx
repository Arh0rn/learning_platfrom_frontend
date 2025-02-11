import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopicContent } from "../api/courses";
import { Box, Typography, Card, CardContent } from "@mui/material";

const ContentBlock = () => {
    const { id, topicId } = useParams();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getTopicContent(id, topicId);
                setContent(data);
            } catch (err) {
                setError("Ошибка загрузки контента");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [id, topicId]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!content) return <Typography>Контент не найден</Typography>;

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Контент темы
                </Typography>
                <Typography variant="body1">{content.content}</Typography>

                {/* Изображения */}
                {content.image_urls && content.image_urls.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        {content.image_urls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt="Topic Image"
                                style={{ maxWidth: "100%" }}
                            />
                        ))}
                    </Box>
                )}

                {/* Видео */}
                {content.video_urls && content.video_urls.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        {content.video_urls.map((url, index) => (
                            <iframe
                                key={index}
                                width="100%"
                                height="315"
                                src={url}
                                title="Topic Video"
                                frameBorder="0"
                                allowFullScreen
                            />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ContentBlock;
