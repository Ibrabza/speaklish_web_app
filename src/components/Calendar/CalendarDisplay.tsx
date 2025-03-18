import { FC, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";
// import {getDataCal} from "@/Features/Calendar/CalendarSlice.ts";

const CalendarDisplay: FC = () => {
    // const [date, setDate] = useState<Date | undefined>(new Date());
    const dispatch = useDispatch<AppDispatch>();
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const results = useSelector((state: RootState) => state.calendar.results);


    useEffect(() => {
        if (results) {
            const dates = results.map(dateStr => new Date(dateStr.start_date));
            setSelectedDates(dates);
        }
    }, [dispatch,results]);

    console.log(results)
    console.log(selectedDates)

    const handleSelect = (dates: Date[] | undefined) => {
        if (dates) {
            setSelectedDates(dates);
        }
    };

    if (!results) return <Loading />;

    return (
        <Calendar
            selected={selectedDates}
            mode="multiple"
            onSelect={handleSelect}
            className="rounded-[24px] bg-[#F5F6FA] w-full"
        />
    );
};

export default CalendarDisplay;
