import {FC} from "react";
import styles from "./QuizButton.module.css"


interface IQuizButton{
    type: "RIGHT" | "LEFT" ;
}

const QuizButton: FC<IQuizButton> = (props) => {
    return (
        <div className={styles.container}>
            {props.type === "LEFT" ? <img src={"/Quiz/leftbutton.svg"} alt={"previous button"} />
                : <img src={"/Quiz/rightbutton.svg"} alt={"next button"} />}
        </div>
    )
}

export default QuizButton;