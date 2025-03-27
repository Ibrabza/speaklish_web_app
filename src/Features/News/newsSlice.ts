import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {getNews} from "@/services/apiServices.ts";

interface INews {
    count: number,
    next: string | null,
    previous: string | null,
    loading: boolean,
    error: string | null | unknown,
    results: INResults[]
}

interface INResults {
    id: number,
    image: string,
    title: string,
    content: string,
}

const initialState: INews = {
    count: 0,
    next: null,
    loading: false,
    error: "",
    previous: null,
    results: [],
}

export const handleGetNews = createAsyncThunk(
    `news/getNews`,
    async () => {
        try {
            return await getNews();
        }catch (error) {
            console.error(error);
            return error;
        }
    }
)

const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers:{
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleGetNews.pending, state => {
            state.loading = true;
        })
            .addCase(handleGetNews.rejected, (state,action) => {
            state.loading = false;
            state.error  = action.payload;
        })
            .addCase(handleGetNews.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false;
                state.error = "";
                state.count = action.payload.count;
                state.previous = action.payload.previous;
                state.next = action.payload.next;
                state.results = action.payload.results;
            })
    }
})

export const { setCount } = newsSlice.actions;

export default newsSlice.reducer;