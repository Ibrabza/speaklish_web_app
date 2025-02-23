import {FC} from "react";
import styles from "./QuizResult.module.css"
import BackButton from "@/components/ui/BackButton.tsx";
import {NavLink} from "react-router-dom";


const QuizResult : FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.result_back__button}>
                <BackButton/>
            </div>

            <div className={styles.result_score}>
                fdfsfsdfsddfdfghjkjhgfdfghj
            </div>

            <div className={styles.result_text}>
                <h3>Congratulations!</h3>
                <p>
                    Let’s keep testing your knowledge by playing more quizzes.
                </p>
                <NavLink to={"review"}>View answers</NavLink>
            </div>

            <button className={styles.result_button} onClick={() => console.log("clicked")}>
                Explore more
            </button>


        </div>
    )
}

export default QuizResult;