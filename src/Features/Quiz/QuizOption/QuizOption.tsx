import {FC} from "react";
import styles from "./QuizOption.module.css"

interface IQuizQuestion {
    question: string,
    onClick: () => void,
    clicked?: boolean,
}


const QuizOption :FC<IQuizQuestion> = (props) => {
    return (
        <div onClick={props.onClick} className={props.clicked ? styles.container_clicked : styles.container}>
            <span>{props.question}</span>
        </div>
    )
}


export default QuizOption;