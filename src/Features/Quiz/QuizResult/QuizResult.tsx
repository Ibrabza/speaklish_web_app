import {FC, useEffect} from "react";
import styles from "./QuizResult.module.css"
import BackButton from "@/components/ui/BackButton.tsx";
import {NavLink} from "react-router-dom";
import { FaUser } from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";
import { handleSubmitQuiz } from "@/Features/Quiz/quizSlice.ts";



const QuizResult : FC = () => {
    const loading = useSelector( (state: RootState) => state.quiz.loading )
    const answers = useSelector( (state : RootState) => state.quiz.answers)
    const first_name = useSelector( (state: RootState) => state.user.first_name)
    const result = useSelector( (state: RootState) => state.quiz.result)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        console.log(answers);
        dispatch(handleSubmitQuiz({lesson_id: 1, answers}));
    }, [dispatch,answers]);

    if(loading || !result) return <Loading/>

    return (
        <div className={styles.container}>
            <div className={styles.result_back__button}>
                <BackButton/>
            </div>

            <div className={styles.result_score}>
                <div className={styles.result_profile}>
                    <FaUser size={40}/>
                </div>
                <div className={styles.result_user_info}>
                    <h3>{first_name}</h3>
                    <p>{result.score}/{result.total_questions}</p>
                </div>
                <img className={styles.white_rect} src={"/Quiz/Rectangle110.svg"} alt={"rectangle svg"}/>
                <img className={styles.green_rect} src={"/Quiz/Rectangle111.svg"} alt={"rectangle svg"}/>
                <img className={styles.green_group} src={"/Quiz/Group-33826.svg"} alt={"rectangle svg"}/>
            </div>

            <div className={styles.result_text}>
                <h3>Congratulations!</h3>
                <p>
                    Let’s keep testing your knowledge by playing more quizzes.
                </p>
                <NavLink to={"/test/lessons/quiz/result/review"}>View answers</NavLink>
            </div>

            <button className={styles.result_button} onClick={() => console.log("clicked")}>
                Explore more
            </button>


        </div>
    )
}

export default QuizResult;