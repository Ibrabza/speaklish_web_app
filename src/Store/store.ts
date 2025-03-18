import {configureStore} from "@reduxjs/toolkit";
import userSlice from "@/Features/User/userSlice.ts";
import sessionSlice from "@/Features/Speaking/Session/sessionSlice.ts"
import quizSlice from "@/Features/Quiz/quizSlice.ts";
import calendarSlice from "@/Features/Calendar/CalendarSlice.ts";
import newsSlice from "@/Features/News/newsSlice.ts";


const store = configureStore({
    reducer: {
        user : userSlice,
        session : sessionSlice,
        quiz: quizSlice,
        calendar : calendarSlice,
        news : newsSlice,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;