import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import AppLayout from "./Pages/AppLayout.tsx";
import Lessons from "./Pages/Lessons/Lessons.tsx";
import Speaking from "./Pages/Speaking/Speaking.tsx";
import Home from "./Pages/Home/Home.tsx";
import Lesson from "@/components/Lesson/Lesson.tsx";
import Quiz from "@/Features/Quiz/Quiz.tsx";
import Auth from "@/Pages/Auth/Auth.tsx";
import {Provider} from "react-redux";
import Store from "@/Store/store.ts";
import QuizResult from "@/Features/Quiz/QuizResult/QuizResult.tsx";
import Pronunciation from "@/Features/Pronunciation/Pronunciation.tsx";
import LessonsLayout from "@/Pages/Lessons/LessonsLayout.tsx";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import QuizReview from "@/Pages/Quiz/QuizReview/QuizReview.tsx";
import Register from "@/Pages/Register/Register.tsx";


const App = () => {
    return (
        <Provider store={Store}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Navigate replace to={'auth'}/>}/>
                    <Route path={'/test/register'} element={<Register/>}/>
                    <Route index path={'auth'} element={<Auth/>}/>
                    <Route path={'/test'} element={<AppLayout/>}>
                        <Route index element={<Navigate replace to={'home'}/>}/>
                        <Route path={'home'} element={<Home/>}/>
                        <Route path={'lessons'} element={<Lessons/>}/>
                    </Route>
                    <Route path={'/test/lessons'} element={<LessonsLayout/>}>
                        <Route path={'lesson/:id'} element={<Lesson/>}/>
                        <Route path={'quiz/:id'} element={<Quiz/>}/>
                        <Route path={'quiz/result/:id'} element={<QuizResult/>}/>
                        <Route path={'quiz/result/review'} element={<QuizReview/>}/>
                        <Route path={'pronunciation/:id'} element={<Pronunciation/>}/>
                    </Route>
                    <Route path={'/test/speaking'} element={<Speaking/>}/>
                    <Route path={"*"} element={<ErrorPage
                        button={"Go to homepage"}
                        message={"something went wrong"}
                        onClick={() => <Navigate to={"/auth"}/> }
                    />}/>
                </Routes>
            </BrowserRouter>
        </Provider>

    )
}


export default App;