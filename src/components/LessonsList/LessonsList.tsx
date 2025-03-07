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

    return (
        <div className={styles.container}>
            <h3 className={styles.lesson_name}>{question_list?.course_title}</h3>
            <ul>
                {question_list?.lessons?.map((item,index) => <li key={item.id}>
                    <LessonsListItem
                        index={item.id}
                        to={(item.title).split(" ").join("/")}
                        title={item.title}
                        date={item.start_date}
                        status={index === 0 ? true : question_list.lessons[index-1].is_completed}/>
                </li>)}
            </ul>
        </div>
    )
}


export default LessonsList;