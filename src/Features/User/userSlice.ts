import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {getLesson, getLessons, getUserProfile, handleLogin} from "@/services/apiServices.ts";

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
    loading: true,
    photo_url: "",
    first_name: "",
    error: "",
    role: "",
    balance: 0,
    isAuthorized : false,
    question_list: null,
    lesson: null,
}


export const handleAuth = createAsyncThunk('user/handleAuth',
    async ({ initData, password, username }:
               { initData: string; password: string; username?: string;}) => {
        try {
            return await handleLogin(initData, password, username);
        }
        catch (error) {
            console.log("error inside the thunk: ", error);
            return Promise.reject(error);
        }
    }
)

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
            .addCase(handleAuth.rejected, (state, action) => {
                state.error = action.payload as string || "something went wrong";
                state.loading = false;
                state.isAuthorized = false;
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
                    const {first_name, photo_url} = window.Telegram.WebApp.initDataUnsafe.user;
                    state.first_name = first_name;
                    state.photo_url = photo_url;
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
            })
            .addCase(getGroupData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "something went wrong";
            })

    }
})

export const { setAccess, setRefresh, setBalance, setRole } = userSlice.actions;

export default userSlice.reducer;