import {FC} from "react";
import LessonsList from "@/components/LessonsList/LessonsList.tsx";


const Lessons: FC = () => {
    return (
        <div className={"lessons"}>
            <LessonsList/>
        </div>
    )
}


export default Lessons;