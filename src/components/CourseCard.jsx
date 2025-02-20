import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ id, title, image_url, description }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                maxWidth: 345,
                height: "100%", // Make the card stretch to full height in its grid cell
                display: "flex",
                flexDirection: "column", // So content + button can stack
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={image_url || "https://via.placeholder.com/345x180"}
                alt={title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>

                {/* 2-line clamp with ellipsis */}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2, // show 2 lines, then ellipsis
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {description}
                </Typography>
            </CardContent>

            <Button
                variant="contained"
                color="primary"
                sx={{ m: 2 }} // margin inside
                onClick={() => navigate(`/course/${id}`)}
            >
                View Course
            </Button>
        </Card>
    );
};

export default CourseCard;
