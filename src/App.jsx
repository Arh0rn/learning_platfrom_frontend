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

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* ✅ Открытые маршруты внутри MainLayout */}
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

                        {/* ✅ Закрытые маршруты внутри MainLayout */}
                        <Route
                            path="/courses"
                            element={
                                <ProtectedRoute>
                                    <CoursesPage />
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

                    {/* ✅ Лейаут материалов курса */}
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
                        <Route
                            path="topic/:topicId/task"
                            element={<TaskPage />}
                        />
                    </Route>

                    {/* ✅ Перенаправление на первую тему курса */}
                    <Route
                        path="/course/:id/materials"
                        element={
                            <ProtectedRoute>
                                <RedirectToFirstTopic />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

/**
 * ✅ Автоматическое перенаправление на первую тему курса.
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
                    console.error("Нет доступных тем в курсе.");
                }
            } catch (error) {
                console.error("Ошибка загрузки курса:", error);
            }
        };

        fetchAndRedirect();
    }, [id, navigate]);

    return null;
};

export default App;
