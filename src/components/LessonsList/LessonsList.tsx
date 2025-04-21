import {FC} from "react";
import styles from "./LessonsList.module.css"
import LessonsListItem from "@/components/LessonsList/LessonsListItem/LessonsListItem.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";


const LessonsList:FC = () => {

    const question_list = useSelector( (state:RootState) => state.user.question_list)
    console.log("lessons",question_list?.lessons)

    if(!question_list) return <Loading/>

    let lesson_list = question_list?.lessons.slice(0);
    lesson_list = lesson_list.sort((a,b) => a.id - b.id);
    return (
        <div className={styles.container}>
            <h3 className={styles.lesson_name}>{question_list?.course_title}</h3>
            <ul>
                {lesson_list.map((item,index) => <li key={item.id}>
                    <LessonsListItem
                        index={index+1}
                        to={`/test/lessons/lesson/${item.id}`}
                        title={item.title}
                        date={item.start_date}
                        status={index === 0 ? true : question_list.lessons[index-1].is_completed}/>
                </li>)}
            </ul>
        </div>
    )
}


export default LessonsList;