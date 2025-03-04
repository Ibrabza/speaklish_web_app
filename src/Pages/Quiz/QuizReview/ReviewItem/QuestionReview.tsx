import {FC} from "react";
import QuestionItem from "@/Pages/Quiz/QuizReview/QuestionItem/QuestionItem.tsx";

import styles from "./QuestionReview.module.css"

interface IQuestingReview {
    index: number,
    question: string,
    right_answer: string,
    questions: [
        string,
        string,
        string,
        string,
    ],
    user_answer: string,
}

const versions = ["A", "B", "C", "D"];


const QuestionReview : FC<IQuestingReview> = (props) => {
    return (
        <div className={styles.container}>
            <h3 className={styles.question}>{props.index}. {props.question}</h3>
            <ul className={styles.list}>
                {props.questions.map((item,i) => <li key={item+i}><QuestionItem index={i} option={item} isCorrect={props.right_answer === versions[i]} isUser={props.user_answer === versions[i]}/></li>)}
            </ul>
        </div>
    )
}

export default QuestionReview;