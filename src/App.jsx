import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
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
import { AuthProvider } from "./context/AuthContext";

// New Course Materials Layout & Pages
import CourseMaterialsLayout from "./layouts/CourseMaterialsLayout";
import ContentPage from "./pages/ContentPage";
import QuizPage from "./pages/QuizPage";
import TaskPage from "./pages/TaskPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <MainLayout>
                    <Routes>
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

                        {/* New Course Materials Layout */}
                        <Route
                            path="/course/:id/materials"
                            element={
                                <ProtectedRoute>
                                    <CourseMaterialsLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                path="content/:topicId"
                                element={<ContentPage />}
                            />
                            <Route
                                path="quiz/:topicId"
                                element={<QuizPage />}
                            />
                            <Route
                                path="task/:topicId"
                                element={<TaskPage />}
                            />
                        </Route>
                    </Routes>
                </MainLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
