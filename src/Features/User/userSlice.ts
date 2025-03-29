import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {getLesson, getLessons, getUserProfile, handleLogin, handleRegister} from "@/services/apiServices.ts";
import {getTelegramUserData} from "@/Helpers/helper.ts";

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
            console.log(initData)
            const response =  await handleLogin("#tgWebAppData=user%3D%257B%2522id%2522%253A606299917%252C%2522first_name%2522%253A%2522Abzal%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ibrabza%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FPm-eMQY1b4e0lD0r_7hAJDHXhx-2dA5UaY1estneYKk.svg%2522%257D%26chat_instance%3D-2236416619848632369%26chat_type%3Dprivate%26auth_date%3D1742034007%26signature%3DUyVgLb_53R8BKWusvymGsf8LAJ-RrhUAN8sfr5swQvWnL9F-dFU0TbJKCOlfhq3e7nGwUzICEv9Rlia5Z7l3Cw%26hash%3D71502d3934cf122ca30932e8092cee98c128931486fb73575d18cd13bb843285&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%236d6d71%22%2C%22text_color%22%3A%22%23000000%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22subtitle_text_color%22%3A%22%23999999%22%2C%22destructive_text_color%22%3A%22%23ff3b30%22%2C%22section_separator_color%22%3A%22%23eaeaea%22%2C%22bg_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23008d94%22%2C%22accent_text_color%22%3A%22%23008d94%22%2C%22button_color%22%3A%22%23008d94%22%2C%22secondary_bg_color%22%3A%22%23efeff3%22%2C%22header_bg_color%22%3A%22%23efeff3%22%2C%22hint_color%22%3A%22%23999999%22%2C%22bottom_bar_bg_color%22%3A%22%23e4e4e4%22%7D", password, username);
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
            // When setting access token, also set isAuthorized to true
            state.isAuthorized = true
        },
        setRefresh: (state, action: PayloadAction<string>) => {
            state.refresh = action.payload
        },
        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload
        },
        setBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload
        },
        setIsAuthorized: (state, action: PayloadAction<boolean>) => {
            state.isAuthorized = action.payload
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
                    console.log(action.payload)
                    state.role = action.payload.role;
                    state.error = null;
                    state.loading = false;
                    state.access = action.payload.access;
                    state.refresh = action.payload.refresh;
                    state.isAuthorized = true;
                    if (action.payload.initData) {
                        const data = getTelegramUserData(action.payload.initData);

                        if (data) {
                            const { firstName: first_name, photoUrl: photo_url } = data;
                            state.first_name = first_name;
                            state.photo_url = photo_url;
                        } else {
                            state.first_name = '';
                            state.photo_url = '';
                        }
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

export const { setAccess, setRefresh, setBalance, setRole, setIsAuthorized } = userSlice.actions;

export default userSlice.reducer;