import {FC} from "react";
import styles from "./Quiz.module.css";
import ConfirmButton from "@/components/ConfirmButton/ConfirmButton.tsx";
import BackButton from "@/components/ui/BackButton.tsx";
import QuizButton from "@/Features/Quiz/QuizButton/QuizButton.tsx";
import QuizOption from "@/Features/Quiz/QuizOption/QuizOption.tsx";



const questions = [
    "A) It helps to reduce nervousness and improves delivery",
    "B) It allows you to memorize the entire speech word-for-word",
    "C) It lets you add random information during the speech",
    "D) It reduces the need for any preparation",

]



const Quiz : FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.quiz_header}>
                <BackButton/>
                <p className={styles.quiz_question_index}>
                    1/10
                </p>
            </div>

            <div className={styles.quiz_main}>
                <div className={styles.quiz_timer}>
                    <QuizButton type={"LEFT"}/>
                    <div className={styles.quiz_timer__item}>
                        3:00
                    </div>
                    <QuizButton type={"RIGHT"} />
                </div>

                <div className={styles.quiz_questions}>
                    <h3>Why is practicing your speecrepeatedly important?</h3>
                    <ul>
                        {questions.map( (item,i) => <li key={i}><QuizOption question={item}/></li>)}
                    </ul>
                </div>
            </div>


            <ConfirmButton handler={() => console.log("hello")} text={"Confirm"}/>
        </div>
    )
}

export default Quiz;