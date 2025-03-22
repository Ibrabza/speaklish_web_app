import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {speakingService} from "@/services/apiSpeaking.ts";

export interface IQuestionPart1 {
    id: number,
    question_txt: string,
    category: number,
    category_name: string,
    is_active: boolean,
    voice_url: string,
    mobile_voice_url: string,
    created_at: string,
    updated_at: string,
}

interface IQuestionPart2 {
    id: number,
    question_txt: string,
    voice_url: string,
    mobile_voice_url: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
}

interface IQuestionPart3 {
    id: number,
    question_txt: string,
    part2_question: number,
    voice_url: string,
    mobile_voice_url: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
}

export interface IFeedback {
    id: number;
    student_id: number;
    feedback: string | null;
    band_score: number | null;
    fluency: number | null;
    vocabulary: number | null;
    grammar: number | null;
    pronunciation: number | null;
    used_topic_words: string[] | null;
    suggested_vocab: string[] | null;
    finish_state: string | null;
    is_test: boolean;
    finished_at: string | null;
    created_at: string;
}

export interface IFeedbackResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IFeedback[];
}


export interface ISessionState {
    id: number,
    part1: IQuestionPart1[] | null,
    part2: IQuestionPart2 | null,
    part3: IQuestionPart3[] | null,
    loading: boolean,
    error : string,
    currentPart : number,
    currentQuestionIndex: number,
    currentQuestion: IQuestionPart1 | IQuestionPart2 | IQuestionPart3 | null,
    showPartComplete: boolean,
    partLength:number,
    feedbackResponse : IFeedbackResponse | null,
}

const initialState: ISessionState = {
    id: 0,
    part1: null,
    part2: null,
    part3: null,
    loading: false,
    error: "",
    currentPart: 1,
    currentQuestionIndex: 0,
    currentQuestion: null,
    showPartComplete: false,
    partLength: 0,
    feedbackResponse: null,
}

export const handleCreateSession = createAsyncThunk(
    `speaking/createSession`,
    async () => {
        try {
            return await speakingService.createSession();

        }catch (error){
            console.log(error)
            throw new Error(error as string)
        }
    }
)

export const submitPart = createAsyncThunk(
    `speaking/submitPart1`,
    async ({part, question_id, session_id, audio} : {part:number, question_id:number, session_id: number, audio: Blob}) => {
        try {
            return await speakingService.question_submit({part, question_id, session_id, audio})
        }catch (error){
            console.log(error)
            throw new Error(error as string)
        }
    }
)

export const handleGetResult = createAsyncThunk(
    `speaking/result`,
    async ({id}:{id:number}) => {
        try{
            return await speakingService.getResult(id);
        }
        catch (error){
            console.log(error)
            throw new Error(error as string)
        }
    }
)

const speakingSlice = createSlice({
    name: "speaking",
    initialState,
    reducers: {
        setCurrentPart: (state, action: PayloadAction<number>) => {
            console.log(state.part1)
            console.log("current part", action.payload);
            if(action.payload !== 4 ) {
                const partKey = `part${action.payload}` as keyof Pick<ISessionState, "part1" | "part2" | "part3">
                console.log(partKey)
                state.currentPart = action.payload;
                state.currentQuestionIndex = 0;
                console.log(Array.isArray(state[partKey]))
                state.partLength = Array.isArray(state[partKey]) ? state[partKey].length : 1;
                if(state[partKey]){
                    if (Array.isArray(state[partKey])) {
                        console.log((state[partKey] as IQuestionPart1[] | IQuestionPart3[])[0])
                        state.currentQuestion = (state[partKey] as IQuestionPart1[] | IQuestionPart3[])[0]
                    } else {
                        state.currentQuestion = state[partKey] as IQuestionPart2
                        console.log(state[partKey] as IQuestionPart2)
                    }
                }else{
                    console.log(state[partKey])
                }
            }else {
                state.currentPart = action.payload;
            }
        },
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            const partKey = `part${state.currentPart}` as keyof Pick<ISessionState, "part1" | "part2" | "part3">
            state.currentQuestionIndex = action.payload;
            if(Array.isArray(state[partKey])){
                state.currentQuestion = (state[partKey] as IQuestionPart1[] | IQuestionPart3[] )[action.payload];
            }else {
                state.currentQuestion = state[partKey] as IQuestionPart2
            }
        },
        setShowPartComplete: (state, action: PayloadAction<boolean>) => {
            state.showPartComplete = action.payload;
        },
        resetSpeaking: (state) => {
            state.partLength = 0;
            state.loading = false;
            state.error = "";
            state.part1 = null;
            state.part2 = null;
            state.part3 = null;
            state.feedbackResponse = null;
            state.id = 0;
            state.showPartComplete = false;
            state.currentPart = 1;
            state.currentQuestionIndex = 0;
            state.currentQuestion = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleCreateSession.pending, state => {
                state.loading = true;
                state.error = "";
            })
            .addCase(handleCreateSession.rejected, (state, action ) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create a session";
            })
            .addCase(handleCreateSession.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                console.log(action.payload)
                state.id = action.payload.id;
                state.part1 = action.payload.part1;
                state.part2 = action.payload.part2;
                state.part3 = action.payload.part3;
                console.log(state.part1)
                console.log(Array.isArray(action.payload.part1))
            })
            .addCase(submitPart.pending , state => {
                state.loading = true;
                state.error = "";
            })
            .addCase(submitPart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to submit part 1";
            })
            .addCase(submitPart.fulfilled, (state,action) => {
                state.loading = false;
                state.error = "";
                console.log(action.payload);
            })
            .addCase(handleGetResult.pending, state => {
                state.loading = true;
                state.error = "";
            })
            .addCase(handleGetResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to get the result of speaking test";
            })
            .addCase(handleGetResult.fulfilled, (state, action) => {
                state.error = "";
                state.loading = false;
                state.feedbackResponse = action.payload;
            })
    }
})

export const { setCurrentPart, setCurrentQuestionIndex, setShowPartComplete, resetSpeaking } = speakingSlice.actions;

export default speakingSlice.reducer