import {configureStore} from "@reduxjs/toolkit";
import userSlice from "@/Features/User/userSlice.ts";
import quizSlice from "@/Features/Quiz/quizSlice.ts";
import calendarSlice from "@/Features/Calendar/CalendarSlice.ts";
import newsSlice from "@/Features/News/newsSlice.ts";
import speakingSlice from "@/Features/Speaking/speakingSlice.ts";


const store = configureStore({
    reducer: {
        user : userSlice,
        quiz: quizSlice,
        calendar : calendarSlice,
        news : newsSlice,
        speaking: speakingSlice,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;