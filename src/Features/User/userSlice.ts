import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleLogin} from "@/services/apiServices.ts";

interface IUser  {
    access : string,
    refresh : string,
    role : string,
    loading: boolean,
    error : string | null,
    balance : number,
    isAuthorized : boolean,
}


const initialState: IUser = {
    access: '',
    refresh: '',
    loading: false,
    error: "",
    role: '',
    balance: 0,
    isAuthorized : false,
}


export const handleAuth = createAsyncThunk('user/handleAuth',
    async ({ initData, password, username, phoneNumber }:
               { initData: string; password: string; username?: string; phoneNumber?: string }) => {
        try {
            return await handleLogin(initData, password, username, phoneNumber);
        }
        catch (error) {
            console.log("error inside the thunk: ", error);
            return Promise.reject(error);
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
            })
            .addCase(handleAuth.fulfilled, (state, action) => {
                state.role = action.payload.role;
                state.error = null;
                state.loading = false;
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                state.isAuthorized = true;
                console.log(action.payload);
            })
    }
})

export const { setAccess, setRefresh, setBalance, setRole } = userSlice.actions;

export default userSlice.reducer;