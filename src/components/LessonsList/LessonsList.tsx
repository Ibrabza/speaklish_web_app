import {FC} from "react";
import styles from "./LessonsList.module.css"
import LessonsListItem from "@/components/LessonsList/LessonsListItem/LessonsListItem.tsx";


const lessons = [
    {
        index: 1,
        to: "1",
        title: "present simple",
        status: true,
        date: "21-10-2025",
    },
    {
        index: 2,
        to: "2",
        title: "present continuous",
        status: true,
        date: "11-07-2025",
    },
    {
        index: 3,
        to: "3",
        title: "past simple",
        status: false,
        date: "11-08-2025",
    },
    {
        index: 4,
        to: "4",
        title: "adjaragudji",
        status: false,
        date: "11-09-2025",
    },
]



const LessonsList:FC = () => {
    return (
        <div className={styles.container}>
            <h3 className={styles.lesson_name}>General English</h3>
            <ul>
                {lessons.map((item) => <li key={item.index}>
                    <LessonsListItem  index={item.index} to={item.to} title={item.title} date={item.date} status={item.status}/>
                </li>)}
            </ul>
        </div>
    )
}


export default LessonsList;