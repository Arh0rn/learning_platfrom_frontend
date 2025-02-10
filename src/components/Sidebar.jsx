import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ course }) => {
    const navigate = useNavigate();
    const [openTopics, setOpenTopics] = useState({});

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
            {course.topics.map((topic) => (
                <div key={topic.id}>
                    <ListItem button onClick={() => toggleTopic(topic.id)}>
                        <ListItemText primary={topic.title} />
                    </ListItem>

                    <Collapse
                        in={openTopics[topic.id]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            <ListItem
                                button
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    navigate(
                                        `/course/${course.id}/materials/content/${topic.id}`
                                    )
                                }
                            >
                                <ListItemText primary="Content" />
                            </ListItem>
                            <ListItem
                                button
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    navigate(
                                        `/course/${course.id}/materials/quiz/${topic.id}`
                                    )
                                }
                            >
                                <ListItemText primary="Quiz" />
                            </ListItem>
                            <ListItem
                                button
                                sx={{ pl: 4 }}
                                onClick={() =>
                                    navigate(
                                        `/course/${course.id}/materials/task/${topic.id}`
                                    )
                                }
                            >
                                <ListItemText primary="Practical Task" />
                            </ListItem>
                        </List>
                    </Collapse>
                </div>
            ))}
        </List>
    );
};

export default Sidebar;
