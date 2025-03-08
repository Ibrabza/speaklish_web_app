import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

import {getQuizResult, getQuizzes, submitQuiz} from "@/services/apiServices.ts";

export interface IAnswer {
    quiz_id: number,
    answer: string,
}

export interface IAnswers {
    correct_answer: string,
    id: number,
    is_correct: boolean,
    options: [
        string,
        string,
        string,
        string,
    ],
    question: string,
    user_answer: string,
}

export interface IResult{
    lesson_id: number,
    score: number,
    total_questions: number,
    answers: IAnswers[],
}

interface IQuiz{
    quizzes: {
            "id": number,
            "lesson": number,
            "question": string,
            "options": [
                string,
                string,
                string,
                string
            ]
        }[] | null,
    timer: number,
    error: unknown | null,
    loading: boolean,
    currentIndex: number,
    answers: IAnswer[],
    result: IResult | null,
}

const initialState: IQuiz = {
    quizzes: null,
    timer: 180,
    error: null,
    loading: false,
    currentIndex: 0,
    answers: [],
    result : null,
}

export const handleGetQuiz = createAsyncThunk('quiz/getQuiz', async ({lesson_id} : { lesson_id : number}) => {
    try {
        return await getQuizzes(lesson_id)
    }catch (error) {
        console.error(error)
    }
})

export const handleSubmitQuiz = createAsyncThunk('quiz/submit', async ({lesson_id, answers} : {lesson_id : number, answers: IAnswer[]}) => {
    try {
        return await submitQuiz(answers, lesson_id);
    }catch (error) {
        console.error(error)
    }
})

export const handleGetQuizResult = createAsyncThunk('quiz/result', async ({lesson_id}: {lesson_id:number}) => {
    try {
        return await getQuizResult(lesson_id);
    }catch (error) {
        console.error(error)
    }
})


const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers:{
        setTimer: (state, action: PayloadAction<number>) => {
            state.timer = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setCurrentIndex: (state, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },
        submitAnswer: (state, action: PayloadAction<IAnswer>) => {
            console.log("before", state.answers, action.payload);
            if(state.answers.length === 0 || state.answers.filter( (ans) => ans.quiz_id === action.payload.quiz_id ).length === 0){
                state.answers.push(action.payload);
                if(state.currentIndex !== (state.quizzes && state.quizzes.length-1)){
                    state.currentIndex++;
                }
            }else {
                state.answers = state.answers.map((ans) => ans.quiz_id === action.payload.quiz_id ? {...ans, answer : action.payload.answer} : ans)
            }
            console.log("after", state.answers, action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleGetQuiz.pending, (state) => {
            state.loading = true;
            })
            .addCase(handleGetQuiz.rejected, (state, action) => {
                state.error = action.payload as string || "something went wrong";
                state.loading = false;
            })
            .addCase(handleGetQuiz.fulfilled, (state, action) => {
                state.quizzes = action.payload;
                state.timer = 180;
                state.loading = false;
                state.error = null;
            })
            .addCase(handleSubmitQuiz.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleSubmitQuiz.rejected, (state, action) => {
                state.error = action.payload as string || "something went wrong";
                state.loading = false;
            })
            .addCase(handleSubmitQuiz.fulfilled, (state, action) => {
                state.result = action.payload;
                state.loading = false;
                state.error = null;
                console.log(action.payload);
            })
            .addCase(handleGetQuizResult.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleGetQuizResult.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(handleGetQuizResult.rejected, (state, action) => {
                state.error = action.payload as string || "something went wrong";
                state.loading = false;
            })
    }
})


export const {setTimer, setError, setCurrentIndex, submitAnswer,setLoading} = quizSlice.actions;

export default quizSlice.reducer;