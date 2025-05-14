import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {getExtendNews, getNews} from "@/services/apiServices.ts";

interface INews {
    count: number,
    next: string | null,
    previous: string | null,
    loading: boolean,
    error: string | null | unknown,
    results: INResults[],
    extendedNews: IExtendedNews | null,
}

interface IExtendedNews {
    id: number,
    slug: string,
    image: string,
    title: string,
    content: string,
    urls: string,
    url_type: string,
}

interface INResults {
    id: number,
    image: string,
    title: string,
    content: string,
    slug: string,
    urls: string,
    url_type: string,
}

const initialState: INews = {
    count: 0,
    next: null,
    loading: false,
    error: "",
    previous: null,
    results: [],
    extendedNews: null
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

export const handleGetExtendedNews = createAsyncThunk(
    `news/getExtendedNews`,
    async (slug:string) => {
        try {
            return await getExtendNews(slug)
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
                state.loading = false;
                state.error = "";
                state.count = action.payload.count;
                state.previous = action.payload.previous;
                state.next = action.payload.next;
                state.results = action.payload.results;
            })
            .addCase(handleGetExtendedNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(handleGetExtendedNews.pending, state => {
                state.loading = true;
                state.error = "";
            })
            .addCase(handleGetExtendedNews.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.extendedNews = action.payload;
            })
    }
})

export const { setCount } = newsSlice.actions;

export default newsSlice.reducer;