import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleGetDataCalendar} from "@/services/apiServices.ts";

interface IResult {
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    meeting_link: string,

}

interface ICalendarSlice {
    count: number,
    next: null | string,
    previous: null | string,
    results: IResult[],
    loading: boolean,
    error: string,
}

const initialState: ICalendarSlice = {
    count: 0,
    next: null,
    previous: null,
    results: [],
    loading: false,
    error: "",
}

export const getDataCal = createAsyncThunk(
    `calendar/getDataCal`,
    async () => {
        try {
            return await handleGetDataCalendar()
        }catch (error) {
            return error
        }
    }
)

const CalendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        setNext: (state, action: PayloadAction<string | null>) => {
            state.next = action.payload
        },
        setPrevious: (state, action: PayloadAction<string | null>) => {
            state.previous = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDataCal.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDataCal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Error occurred';
            })
            .addCase(getDataCal.fulfilled, (state, action) => {
                state.loading = false;
                state.count = action.payload.count;
                state.previous = action.payload.previous;
                state.next = action.payload.next;
                state.results = action.payload.results;
                state.error = "";
            })
    }
})

export const { setCount, setNext, setPrevious } = CalendarSlice.actions;

export default CalendarSlice.reducer;