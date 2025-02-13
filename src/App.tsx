import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import AppLayout from "./Pages/AppLayout.tsx";
import Lessons from "./Pages/Lessons/Lessons.tsx";
import Speaking from "./Pages/Speaking/Speaking.tsx";
import Home from "./Pages/Home/Home.tsx";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/test'} element={<AppLayout/>}>
                    <Route index element={<Navigate replace to={'home'}/>}/>
                    <Route path={'home'} element={<Home/>}/>
                    <Route path={'lessons'} element={<Lessons/>}/>
                    <Route path={'speaking'} element={<Speaking/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}


export default App;