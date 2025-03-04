import {configureStore} from "@reduxjs/toolkit";
import userSlice from "@/Features/User/userSlice.ts";
import sessionSlice from "@/Features/Speaking/Session/sessionSlice.ts"
import quizSlice from "@/Features/Quiz/quizSlice.ts";


const store = configureStore({
    reducer: {
        user : userSlice,
        session : sessionSlice,
        quiz: quizSlice,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;