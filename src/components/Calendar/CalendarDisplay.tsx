import {FC, useState} from "react";
import styles from "./CalendarDisplay.module.css"
import { Calendar } from "@/components/ui/calendar"


const CalendarDisplay: FC = () =>{
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <div className={styles.calBlock}>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-[24px] bg-[#F5F6FA] w-full"
            />
        </div>
    )
}

export default CalendarDisplay;