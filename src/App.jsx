import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CourseMaterialsLayout from "./layouts/CourseMaterialsLayout";
import Home from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmPage from "./pages/ConfirmPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ConfirmResetPage from "./pages/ConfirmResetPage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ContentPage from "./pages/ContentPage";
import QuizPage from "./pages/QuizPage";
import TaskPage from "./pages/TaskPage";
import { AuthProvider } from "./context/AuthContext";
import { getCourseById } from "./api/courses";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyCoursesPage from "./pages/MyCoursesPage"; // "My Courses" page

// Forum imports:
import ForumLayout from "./layouts/ForumLayout";
import ForumHomePage from "./pages/forum/ForumHomePage";
import ForumQuestionPage from "./pages/forum/ForumQuestionPage";
import AskQuestionPage from "./pages/forum/AskQuestionPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* ✅ Public routes under MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/confirm" element={<ConfirmPage />} />
                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />
                        <Route
                            path="/confirm-reset"
                            element={<ConfirmResetPage />}
                        />

                        {/* ✅ Protected routes under MainLayout */}
                        <Route
                            path="/courses"
                            element={
                                <ProtectedRoute>
                                    <CoursesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-courses"
                            element={
                                <ProtectedRoute>
                                    <MyCoursesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/course/:id"
                            element={
                                <ProtectedRoute>
                                    <CoursePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <AccountPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* ✅ Course Materials Layout */}
                    <Route
                        path="/course/:id/materials"
                        element={
                            <ProtectedRoute>
                                <CourseMaterialsLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="topic/:topicId/content"
                            element={<ContentPage />}
                        />
                        <Route
                            path="topic/:topicId/quiz"
                            element={<QuizPage />}
                        />
                        {/* 
                            Replace topic/:topicId/task with topic/:topicId/task/:order
                            so the TaskPage can load tasks #1, #2, #3, etc.
                        */}
                        <Route
                            path="topic/:topicId/task/:order"
                            element={<TaskPage />}
                        />
                    </Route>

                    {/* ✅ Auto-redirect to first topic if no subroute */}
                    <Route
                        path="/course/:id/materials"
                        element={
                            <ProtectedRoute>
                                <RedirectToFirstTopic />
                            </ProtectedRoute>
                        }
                    />

                    {/* ✅ Forum routes with ForumLayout */}
                    <Route path="/forum" element={<ForumLayout />}>
                        <Route index element={<ForumHomePage />} />
                        <Route
                            path="category/:catId"
                            element={<ForumHomePage />}
                        />
                        <Route
                            path="question/:id"
                            element={<ForumQuestionPage />}
                        />
                        <Route path="ask" element={<AskQuestionPage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

/**
 * ✅ Automatically redirect to the first topic’s content
 */
const RedirectToFirstTopic = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndRedirect = async () => {
            try {
                const data = await getCourseById(id);
                if (data.topics.length > 0) {
                    navigate(
                        `/course/${id}/materials/topic/${data.topics[0].id}/content`
                    );
                } else {
                    console.error("No themes in course");
                }
            } catch (error) {
                console.error("Course loading error:", error);
            }
        };

        fetchAndRedirect();
    }, [id, navigate]);

    return null;
};

export default App;
