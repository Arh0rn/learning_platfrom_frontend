// src/components/Sidebar.jsx
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const [openTopics, setOpenTopics] = useState({});
    const [course, setCourse] = useState(null);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const storedCourse = localStorage.getItem("currentCourse");
        if (storedCourse) {
            try {
                const parsedCourse = JSON.parse(storedCourse);
                if (parsedCourse && parsedCourse.topics) {
                    setCourse(parsedCourse.course);
                    setTopics(parsedCourse.topics);
                } else {
                    console.warn("Sidebar: Topics not found in stored course");
                }
            } catch (error) {
                console.error("Sidebar: Error parsing course data:", error);
            }
        }
    }, []);

    const toggleTopic = (topicId) => {
        setOpenTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
    };

    return (
        <List
            sx={{
                width: "250px",
                bgcolor: "background.paper",
                height: "100vh",
                overflowY: "auto",
            }}
        >
            {topics.length > 0 ? (
                topics.map((topic) => (
                    <div key={topic.id}>
                        <ListItem
                            component="div"
                            onClick={() => toggleTopic(topic.id)}
                            sx={{
                                transition: "0.2s",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            <ListItemText primary={topic.title} />
                        </ListItem>

                        <Collapse
                            in={openTopics[topic.id]}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                {/* Content */}
                                <ListItem
                                    component="div"
                                    sx={{ pl: 4, cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            `/course/${course?.id}/materials/topic/${topic.id}/content`
                                        )
                                    }
                                >
                                    <ListItemText primary="📖 Content" />
                                </ListItem>

                                {/* Quiz */}
                                <ListItem
                                    component="div"
                                    sx={{ pl: 4, cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            `/course/${course?.id}/materials/topic/${topic.id}/quiz`
                                        )
                                    }
                                >
                                    <ListItemText primary="📝 Quiz" />
                                </ListItem>

                                {/* 3 tasks */}
                                <ListItem
                                    component="div"
                                    sx={{ pl: 4, cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            `/course/${course?.id}/materials/topic/${topic.id}/task/1`
                                        )
                                    }
                                >
                                    <ListItemText primary="💻 Task #1" />
                                </ListItem>
                                <ListItem
                                    component="div"
                                    sx={{ pl: 4, cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            `/course/${course?.id}/materials/topic/${topic.id}/task/2`
                                        )
                                    }
                                >
                                    <ListItemText primary="💻 Task #2" />
                                </ListItem>
                                <ListItem
                                    component="div"
                                    sx={{ pl: 4, cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            `/course/${course?.id}/materials/topic/${topic.id}/task/3`
                                        )
                                    }
                                >
                                    <ListItemText primary="💻 Task #3" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </div>
                ))
            ) : (
                <ListItem>
                    <ListItemText primary="🚧 Темы пока не добавлены" />
                </ListItem>
            )}
        </List>
    );
};

export default Sidebar;
