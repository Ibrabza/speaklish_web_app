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


const App = () => {
    return (
        <Provider store={Store}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Navigate replace to={'auth'}/>}/>
                    <Route index path={'auth'} element={<Auth/>}/>
                    <Route path={'/test'} element={<AppLayout/>}>
                        <Route index element={<Navigate replace to={'home'}/>}/>
                        <Route path={'home'} element={<Home/>}/>
                        <Route path={'lessons'} element={<Lessons/>}/>
                        <Route path={'lessons/:id'} element={<Lesson/>}/>
                        <Route path={'lessons/quiz/:id'} element={<Quiz/>}/>
                        <Route path={'speaking'} element={<Speaking/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>

    )
}


export default App;