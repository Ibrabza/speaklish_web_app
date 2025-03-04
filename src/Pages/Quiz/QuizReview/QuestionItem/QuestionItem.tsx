import {FC} from "react";

import styles from "./QuestionItem.module.css"

interface IQuestionItem {
    index: number;
    option: string,
    isCorrect: boolean,
    isUser: boolean,
}
const versions = ["A", "B", "C", "D"];

const QuestionItem : FC<IQuestionItem> = (props) => {
    return (
        <div className={props.isUser ? props.isCorrect ? styles.correct : styles.wrong : props.isCorrect ? styles.correct : styles.container}>
            <h3>
                {versions[props.index]}){props.option}
            </h3>
        </div>
    )
}

export default QuestionItem;