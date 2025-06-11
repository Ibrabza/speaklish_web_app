import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import Store from "@/Store/store.ts";
import { useEffect, Suspense, lazy } from "react";
import { restoreAuthState } from "@/services/authService";
import { AppDispatch } from "@/Store/store";
import { getGroupData } from "@/Features/User/userSlice";
import { init, swipeBehavior } from '@telegram-apps/sdk';
import Loading from "@/components/Loading.tsx";

const AppLayout = lazy(() => import('@/Pages/AppLayout.tsx'))
const LessonsLayout = lazy(() => import("@/Pages/Lessons/LessonsLayout.tsx"));
const ErrorPage = lazy(() => import("@/Pages/Error/ErrorPage.tsx"))
const Home = lazy(() => import("@/Pages/Home/Home"));
const Lessons = lazy(() => import("@/Pages/Lessons/Lessons"));
const Speaking = lazy(() => import("@/Pages/Speaking/Speaking"));
const Lesson = lazy(() => import("@/components/Lesson/Lesson"));
const Quiz = lazy(() => import("@/Features/Quiz/Quiz"));
const QuizResult = lazy(() => import("@/Features/Quiz/QuizResult/QuizResult"));
const QuizReview = lazy(() => import("@/Pages/Quiz/QuizReview/QuizReview"));
const Pronunciation = lazy(() => import("@/Features/Pronunciation/Pronunciation"));
const Auth = lazy(() => import("@/Pages/Auth/Auth"));
const Register = lazy(() => import("@/Pages/Register/Register"));
const History = lazy(() => import("@/Pages/History/History"));


init();

if (swipeBehavior.mount.isAvailable()) {
    swipeBehavior.mount();
}
if (swipeBehavior.enableVertical.isAvailable()) {
    swipeBehavior.disableVertical();
}

// Component to handle auth state restoration
const AuthStateRestorer = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
        // Restore authentication state from localStorage on app initialization
        const isRestored = restoreAuthState(dispatch);
        console.log("Auth state restoration attempted:", isRestored ? "successful" : "no stored tokens found");
        
        // If authentication was restored successfully, fetch user data
        if (isRestored) {
            // Fetch user profile data using the Redux thunk
            dispatch(getGroupData())
                .unwrap()
                .then(() => {
                    console.log("User profile data fetched successfully");
                })
                .catch((error) => {
                    console.error("Failed to fetch user profile data:", error);
                });
        }
    }, [dispatch]);
    
    return null; // This component doesn't render anything
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthStateRestorer />
            <Suspense fallback={<Loading/>}>
                <Routes>
                    <Route path="auth" element={<Auth />} />
                    <Route path="register" element={<Register />} />

                    <Route path="/" element={<Navigate replace to="auth" />} />
                    <Route path="/app" element={<AppLayout />}>
                        <Route index element={<Navigate replace to="home" />} />
                        <Route path="home" element={<Home />} />
                        <Route path="lessons" element={<Lessons />} />
                        <Route path="home/history" element={<History />} />
                    </Route>

                    <Route path="app/lessons" element={<LessonsLayout />}>
                        <Route path="lesson/:id" element={<Lesson />} />
                        <Route path="quiz/:id" element={<Quiz />} />
                        <Route path="quiz/result/:id" element={<QuizResult />} />
                        <Route path="quiz/result/review" element={<QuizReview />} />
                        <Route path="pronunciation/:id" element={<Pronunciation />} />
                    </Route>

                    <Route path="app/speaking" element={<Speaking />} />

                    <Route
                        path="*"
                        element={
                            <ErrorPage
                                button="Go to homepage"
                                message="Something went wrong"
                                onClick={() => window.location.href = "/auth"}
                            />
                        }
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

const App = () => (
    <Provider store={Store}>
        <AppRoutes />
    </Provider>
);

export default App;
