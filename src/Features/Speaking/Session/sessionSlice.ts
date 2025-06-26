// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import apiClient from "@/services/apiClient";
//
// export interface IQuestion {
//     id: number;
//     options?: string[];
//     answer?: string;
//     question_txt: string,
//     voice_url: string,
//     mobile_voice_url: string,
//     category: string
// }
//
// // interface Questions {
// //     [key: string]: IQuestion[] | undefined;
// // }
//
// interface ISession {
//     user_id: number,
//     session_id: string,
//     referral_code: string | number | null,
//     part1_question: IQuestion[],
//     part2_question: IQuestion[],
//     part3_question: IQuestion[],
// }
//
// interface SessionState {
//     currentPart: number;
//     currentQuestionIndex: number;
//     currentQuestion: IQuestion | null;
//     session: ISession | null;
//     questions : {
//         part1 : IQuestion[];
//         part2 : IQuestion;
//         part3 : IQuestion[];
//     } | null;
//     showPartComplete: boolean;
//     loading: boolean;
//     error: boolean | string;
// }
//
// const initialState: SessionState = {
//     currentPart: 0,
//     currentQuestionIndex: 0,
//     currentQuestion: null,
//     session: null,
//     questions: null,
//     showPartComplete: false,
//     loading: false,
//     error: false,
// };
//
// interface IRecord {
//     user_id: number,
//     is_test: boolean
// }
//
// export const getSessionData = createAsyncThunk(
//     'session/getSessionData',
//     async ({user_id, is_test} : IRecord) => {
//         try {
//             const response = await apiClient.get('/school/session-create/', {
//                 params: {user_id, is_test},
//             });
//             console.log(response.data);
//             return response.data;
//         } catch (error) {
//             console.error('Failed to get data from session:', error);
//             // return rejectWithValue(error.response.data || 'Failed to fetch data');
//         }
//     }
// );
//
// const sessionSlice = createSlice({
//     name: 'session',
//     initialState,
//     reducers: {
//         setShowPartComplete: (state, action: PayloadAction<boolean>) => {
//             state.showPartComplete = action.payload;
//         },
//         setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
//             state.currentQuestionIndex = action.payload;
//             if(state.questions){
//                 const partKey = `part${state.currentPart}` as keyof typeof state.questions;
//                 if(partKey !== `part2`) {
//                     state.currentQuestion = state.questions[partKey]?.[action.payload];
//                 }else {
//                     state.currentQuestion = state.questions[partKey];
//                 }
//             }
//         },
//         setCurrentPart: (state, action: PayloadAction<number>) => {
//             state.currentPart = action.payload;
//             if(state.questions){
//                 const partKey = `part${action.payload}` as keyof typeof state.questions;
//                 if(partKey === `part2`) {
//                     state.currentQuestion = state.questions.part2
//                 }else {
//                     state.currentQuestion = state.questions[partKey]?.[0] || null;
//                     state.currentQuestionIndex = 0;
//                 }
//             }
//         },
//         setLoading: (state, action: PayloadAction<boolean>) => {
//             state.loading = action.payload;
//         },
//         setError: (state, action: PayloadAction<boolean | string>) => {
//             state.error = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getSessionData.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(getSessionData.rejected, (state, action) => {
//                 state.error = action.payload as string || 'Error occurred';
//                 state.loading = false;
//             })
//             .addCase(getSessionData.fulfilled, (state, action) => {
//                 console.log(action.payload);
//                 state.session = action.payload;
//                 state.questions = {
//                     part1: action.payload.part1_questions,
//                     part2: action.payload.part2_question,
//                     part3: action.payload.part3_questions,
//                 }
//                 state.currentQuestion = action.payload.part1_questions[0];
//                 state.loading = false;
//             });
//     },
// });
//
// export const { setShowPartComplete, setCurrentPart, setLoading, setError, setCurrentQuestionIndex } = sessionSlice.actions;
//
// export default sessionSlice.reducer;
