import {FC} from "react";
import styles from "./QuizOption.module.css"

interface IQuizQuestion {
    question: string,
}


const QuizOption :FC<IQuizQuestion> = (props) => {
    return (
        <div className={styles.container}>
            <span>{props.question}</span>
        </div>
    )
}


export default QuizOption;