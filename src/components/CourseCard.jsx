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
        <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
            <CardMedia
                component="img"
                height="180"
                image={image_url || "https://via.placeholder.com/345x180"} // Placeholder image
                alt={title}
            />
            <CardContent>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {description}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/course/${id}`)}
                >
                    View Course
                </Button>
            </CardContent>
        </Card>
    );
};

export default CourseCard;
