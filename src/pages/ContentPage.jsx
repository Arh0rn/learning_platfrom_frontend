import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopicContent } from "../api/courses";
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Card,
    CardContent,
    Divider,
    Link,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ContentPage = () => {
    const { id, topicId } = useParams();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getTopicContent(id, topicId);
                if (data.content) {
                    data.content = data.content.replace(/\\n/g, "\n"); // Фикс переноса строк
                }
                setContent(data);
            } catch (error) {
                console.error("Content load error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [id, topicId]);

    if (loading) return <CircularProgress />;
    if (!content) return <Typography>Контент не найден</Typography>;

    return (
        <Container maxWidth="md">
            {/* Заголовок */}
            <Typography variant="h4" gutterBottom></Typography>

            {/* Основной контент (Markdown) */}
            <Card sx={{ mb: 3, p: 2 }}>
                <CardContent>
                    <ReactMarkdown
                        children={content.content}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => (
                                <Link
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            img: ({ node, ...props }) => (
                                <Box
                                    component="img"
                                    sx={{
                                        maxWidth: "100%",
                                        my: 2,
                                        borderRadius: 2,
                                    }}
                                    {...props}
                                />
                            ),
                        }}
                    />
                </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            {/* Видео (YouTube) */}
            {content.video_urls?.length > 0 && (
                <Box sx={{ my: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Video
                    </Typography>
                    {content.video_urls.map((videoUrl, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 2,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <iframe
                                width="100%"
                                height="400"
                                src={videoUrl}
                                title={`Видео ${index + 1}`}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Изображения */}
            {content.image_urls?.length > 0 && (
                <Box sx={{ my: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Images
                    </Typography>
                    {content.image_urls.map((imgUrl, index) => (
                        <Box key={index} sx={{ textAlign: "center", my: 2 }}>
                            <img
                                src={imgUrl}
                                alt={`Image ${index + 1}`}
                                style={{ maxWidth: "100%", borderRadius: 8 }}
                            />
                        </Box>
                    ))}
                </Box>
            )}

            {/* Дополнительные ресурсы */}
            {content.additional_resources?.length > 0 && (
                <Box sx={{ my: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Additional sources
                    </Typography>
                    <ul>
                        {content.additional_resources.map((resource, index) => (
                            <li key={index}>
                                <Link
                                    href={resource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {resource}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
        </Container>
    );
};

export default ContentPage;
