import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiClient from "@/services/apiClient";

interface Question {
    id: number;
    question: string;
    options?: string[];
    answer?: string;
}

interface Questions {
    [key: string]: Question[] | undefined;
}

interface SessionState {
    currentPart: number;
    currentQuestionIndex: number;
    questions: Questions;
    loading: boolean;
    error: boolean | string;
    session: string | null; // You may replace 'any' with a specific type if session data structure is known
    currentQuestion: Question | null;
    showPartComplete: boolean;
}

const initialState: SessionState = {
    currentPart: 0,
    currentQuestionIndex: 0,
    questions: {},
    loading: false,
    error: false,
    session: null,
    currentQuestion: null,
    showPartComplete: false,
};

interface IRecord {
    user_id: number,
    is_test: boolean
}

export const getSessionData = createAsyncThunk(
    'session/getSessionData',
    async (params: IRecord, thunkAPI) => {
        try {
            const response = await apiClient.get('/school/session-create/', {
                params: params,
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to get data from session:', error);
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setShowPartComplete: (state, action: PayloadAction<boolean>) => {
            state.showPartComplete = action.payload;
        },
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
            const questionSet = state.questions[`part${state.currentPart}`];

            state.currentQuestion = questionSet?.length ? questionSet[action.payload] : null;
        },
        setCurrentPart: (state, action: PayloadAction<number>) => {
            state.currentPart = action.payload;
            const questionSet = state.questions[`part${action.payload}`];

            state.currentQuestion = questionSet?.length ? questionSet[state.currentQuestionIndex] : null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<boolean | string>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSessionData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSessionData.rejected, (state, action) => {
                state.error = action.payload as string || 'Error occurred';
                state.loading = false;
            })
            .addCase(getSessionData.fulfilled, (state, action) => {
                state.questions = {
                    part1: action.payload.part1_questions,
                    part2: action.payload.part2_question, // Ensure correct key name
                    part3: action.payload.part3_questions,
                };
                state.loading = false;
                state.session = action.payload;
            });
    },
});

export const { setShowPartComplete, setCurrentPart, setLoading, setError, setCurrentQuestionIndex } = sessionSlice.actions;

export default sessionSlice.reducer;
