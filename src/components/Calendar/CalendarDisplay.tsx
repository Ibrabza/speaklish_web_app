import { FC, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Store/store.ts";
import SmallLoading from "@/components/SmallLoading/SmallLoading.tsx";

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

    if (!results) return <SmallLoading />;

    return (
        <Calendar
            selected={selectedDates}
            mode="multiple"
            onSelect={() => {"hello"}}
            className="rounded-[24px] bg-[#F5F6FA] w-full"
        />
    );
};

export default CalendarDisplay;
