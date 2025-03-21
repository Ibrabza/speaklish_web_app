import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {getLesson, getLessons, getUserProfile, handleLogin, handleRegister} from "@/services/apiServices.ts";

interface IUser  {
    id: number | null,
    first_name : string,
    last_name: string,
    role : string,
    balance : number,
    request_balance: number,
    phone: number,
    photo_url : string,
    telegram_id: number,
    email: string,
    group: {
        id: number,
        name: string,
    }
    access : string,
    refresh : string,
    loading: boolean,
    error : string | null,
    isAuthorized : boolean,
    question_list: {
        "course_id": number,
        "course_title": string,
        "lessons":
            {
                "id": number,
                "title": string,
                "start_date": string,
                "end_date": string,
                "is_completed": boolean
            }[]
    } | null,
    lesson: {
        id: number,
        title: string,
        description: string,
        start_date: string,
        end_date: string,
        video: string,
        meeting_link: string,
        files:
            {
                url: string,
                name: string,
                size: number
            }[] | null,
        "quiz": {
            id: number,
            lesson: number,
            question: number,
            options: [
                string,
                string,
                string,
                string
            ] | null
        }[] | null,
    } | null,
}


const initialState: IUser = {
    id: 0,
    request_balance: 0,
    phone: 0,
    telegram_id: 0,
    email: "",
    group : {
      id: 0,
      name: "",
    },
    last_name: "",
    access: "",
    refresh: "",
    loading: false,
    photo_url: "",
    first_name: "",
    error: "",
    role: "",
    balance: 0,
    isAuthorized : false,
    question_list: null,
    lesson: null,
}


export const handleReg = createAsyncThunk(
    'user/register',
    async ({password, phone, telegram_id, tma} : {password: string, phone: string, telegram_id: number, tma?: string}, { rejectWithValue }) => {
        try {
            console.log('Registration thunk called with tma:', tma ? 'present' : 'not provided');
            return await handleRegister({password, phone, telegram_id, tma})
        }
        catch (error) {
            console.error('Registration error in thunk:', error);
            return rejectWithValue(error);
        }
    }
)

export const handleAuth = createAsyncThunk(
    'user/handleAuth',
    async ({ initData, password, username }:
               { initData: string; password: string; username?: string; }, { rejectWithValue }) => {
        try {
            const response =  await handleLogin(initData, password, username);
            console.log(response);
            return response;
        } catch (error) {
            console.log("error inside the thunk: ", error);
            return rejectWithValue(error);
        }
    }
);

export const getGroupData = createAsyncThunk('user/getGroupData',
    async () => {
        try {
            return await getUserProfile();
        }catch (error){
            console.log(error)
            return Promise.reject(error);
        }
    })


export const handleGetLessons = createAsyncThunk(
    'user/handleGetLessons',
    async (_, { rejectWithValue }) => {
        try {
            // console.log(access_token);
            return await getLessons();
        } catch (error) {
            console.error(error);
            return rejectWithValue(error);
        }
    }
);

export const handleGetLesson = createAsyncThunk(
    'user/getLesson',
    async ({lesson_id}:{lesson_id:number}, { rejectWithValue }) => {
        try {
            // console.log(lesson_id, access_token)
            return await getLesson(lesson_id)
        }catch (error) {
            console.log(error)
            return rejectWithValue(error)
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAccess: (state, action: PayloadAction<string>) => {
            state.access = action.payload
        },
        setRefresh: (state, action: PayloadAction<string>) => {
            state.refresh = action.payload
        },
        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload
        },
        setBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleAuth.pending, (state) => {
            state.loading = true;
        })
            .addCase(handleReg.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleReg.rejected, (state, action) => {
                state.loading = false;
                // Handle error properly by converting to string if it's an object
                if (action.payload instanceof Error) {
                    state.error = action.payload.message || 'Registration failed';
                } else if (typeof action.payload === 'object' && action.payload !== null) {
                    state.error = JSON.stringify(action.payload) || 'Registration failed';
                } else {
                    state.error = action.payload as string || 'Registration failed';
                }
            })
            .addCase(handleReg.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                console.log('Registration successful:', action.payload);
                
                // If the registration response includes tokens, store them
                if (action.payload) {
                    if (action.payload.access) {
                        state.access = action.payload.access;
                        console.log('Storing access token from registration');
                    }
                    if (action.payload.refresh) {
                        state.refresh = action.payload.refresh;
                        console.log('Storing refresh token from registration');
                    }
                }
            })
            .addCase(handleAuth.rejected, (state, action) => {
                state.loading = false;
                state.isAuthorized = false;
                
                // Extract the error message properly
                if (action.payload instanceof Error) {
                    state.error = action.payload.message;
                    console.log('Error instance:', action.payload.message);
                } else if (typeof action.payload === 'object' && action.payload !== null) {
                    // Try to extract message from JSON object
                    try {
                        const errorObj = action.payload as { message?: string };
                        if (errorObj.message) {
                            state.error = errorObj.message;
                        } else {
                            state.error = JSON.stringify(action.payload);
                        }
                    } catch {
                        state.error = JSON.stringify(action.payload);
                    }
                    console.log('Error object:', state.error);
                } else if (typeof action.payload === 'string') {
                    // Check if the string contains a JSON object
                    if (action.payload.includes('{') && action.payload.includes('}')) {
                        try {
                            const errorObj = JSON.parse(action.payload.substring(
                                action.payload.indexOf('{'),
                                action.payload.lastIndexOf('}') + 1
                            ));
                            if (errorObj.message) {
                                state.error = errorObj.message;
                            } else {
                                state.error = action.payload;
                            }
                        } catch {
                            state.error = action.payload;
                        }
                    } else {
                        state.error = action.payload;
                    }
                    console.log('Error string:', state.error);
                } else {
                    state.error = "Authentication failed";
                    console.log('Unknown error type');
                }
            })
            .addCase(handleAuth.fulfilled, (state, action) => {
                if(!action.payload.access){
                    state.error = "Not authorized to access";
                    state.isAuthorized = false;
                }else {
                    state.role = action.payload.role;
                    state.error = null;
                    state.loading = false;
                    state.access = action.payload.access;
                    state.refresh = action.payload.refresh;
                    state.isAuthorized = true;
                    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
                        const {first_name, photo_url} = window.Telegram.WebApp.initDataUnsafe.user;
                        state.first_name = first_name || '';
                        state.photo_url = photo_url || '';
                    }
                }
                // console.log(action.payload);
                // localStorage.setItem()
                // localStorage.setItem("access_token", JSON.stringify(action.payload.access));
            })
            .addCase(handleGetLessons.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleGetLessons.rejected, (state, action) => {
                state.error = action.payload as string || "something went wrong";
                state.loading = false;
            })
            .addCase(handleGetLessons.fulfilled, (state, action) => {
                state.question_list = action.payload;
                state.loading = false;
            })
            .addCase(handleGetLesson.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleGetLesson.rejected, (state, action) => {
                state.error = action.payload as string || "something went wrong";
                state.loading = false;
            })
            .addCase(handleGetLesson.fulfilled, (state, action) => {
                // state.lesson = action.payload;
                state.lesson = action.payload ?? null;
                state.loading = false;
            })
            .addCase(getGroupData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupData.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.request_balance = action.payload.request_balance
                state.email = action.payload.email;
                state.telegram_id = action.payload.telegram_id;
                state.group.id = action.payload.group.id;
                state.group.name = action.payload.group.name;
                state.photo_url = action.payload.photo || state.photo_url;
            })
            .addCase(getGroupData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "something went wrong";
            })

    }
})

export const { setAccess, setRefresh, setBalance, setRole } = userSlice.actions;

export default userSlice.reducer;