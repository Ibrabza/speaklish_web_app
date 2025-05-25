import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import Store from "@/Store/store.ts";
import { useEffect } from "react";

import AppLayout from "@/Pages/AppLayout.tsx";
import LessonsLayout from "@/Pages/Lessons/LessonsLayout.tsx";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import Home from "@/Pages/Home/Home.tsx";
import Lessons from "@/Pages/Lessons/Lessons.tsx";
import Speaking from "@/Pages/Speaking/Speaking.tsx";
import Lesson from "@/components/Lesson/Lesson.tsx";
import Quiz from "@/Features/Quiz/Quiz.tsx";
import QuizResult from "@/Features/Quiz/QuizResult/QuizResult.tsx";
import QuizReview from "@/Pages/Quiz/QuizReview/QuizReview.tsx";
import Pronunciation from "@/Features/Pronunciation/Pronunciation.tsx";
import Auth from "@/Pages/Auth/Auth.tsx";
import Register from "@/Pages/Register/Register.tsx";
import { restoreAuthState } from "@/services/authService.ts";
import { AppDispatch } from "@/Store/store.ts";
import { getGroupData } from "@/Features/User/userSlice.ts";
import History from "@/Pages/History/History.tsx"
import { init } from '@telegram-apps/sdk';
import { swipeBehavior } from '@telegram-apps/sdk';


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
                            onClick={() => <Navigate to="/auth" />}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

const App = () => (
    <Provider store={Store}>
        <AppRoutes />
    </Provider>
);

export default App;
