import {FC, useEffect, useState} from "react";
import styles from "./QuizResult.module.css"
import BackButton from "@/components/ui/BackButton.tsx";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";
import {handleSubmitQuiz, setResetAnswers} from "@/Features/Quiz/quizSlice.ts";



const QuizResult : FC = () => {
    const [tempLoading, setTempLoading] = useState(true);
    const loading = useSelector( (state: RootState) => state.quiz.loading )
    const answers = useSelector( (state : RootState) => state.quiz.answers)
    const first_name = useSelector( (state: RootState) => state.user.first_name)
    const result = useSelector( (state: RootState) => state.quiz.result)
    const image_profile = useSelector( (state:RootState) => state.user.photo_url)
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {id: lesson_id } = useParams();

    useEffect(() => {
        console.log(answers);
        dispatch(handleSubmitQuiz({lesson_id: Number(lesson_id), answers}));
        dispatch(setResetAnswers())
    }, [dispatch, lesson_id]);

    useEffect(() => {
        setTempLoading(true)

        setTimeout(()=> setTempLoading(false), 5000)
    }, []);

    // useEffect(() => {
    //     if(!loading) {
    //         dispatch(setLoading(true))
    //     }
    //     setTimeout(() => dispatch(setLoading(false)), 4000)
    // }, [dispatch, loading]);

    if(loading || !result) return <Loading/>

    return (
        <div className={styles.container}>
            {tempLoading && <div className={"absolute bg-gray-50 w-dvw h-dvh z-20"}><Loading/></div>}
            <div className={styles.result_back__button}>
                <BackButton to={"/app/home"}/>
            </div>

            <div className={styles.result_score}>
                <div className={styles.result_profile}>
                    {/*<FaUser size={40}/>*/}
                    <img src={image_profile} alt={"speaklish profile"}/>
                </div>
                <div className={styles.result_user_info}>
                    <h3>{first_name}</h3>
                    <p>{result.score}/{result.total_questions}</p>
                </div>
                {/*<img className={styles.white_rect} src={"/Quiz/Rectangle110.svg"} alt={"rectangle svg"}/>*/}
                {/*<img className={styles.green_rect} src={"/Quiz/Rectangle111.svg"} alt={"rectangle svg"}/>*/}
                {/*<img className={styles.green_group} src={"/Quiz/Group-33826.svg"} alt={"rectangle svg"}/>*/}
            </div>

            <div className={styles.result_text}>
                <h3>Congratulations!</h3>
                <p>
                    Let’s keep testing your knowledge by playing more quizzes.
                </p>
                <NavLink to={"/app/lessons/quiz/result/review"}>View answers</NavLink>
            </div>

            <button className={styles.result_button} onClick={() => navigate(`/app/lessons/lesson/${lesson_id}`)}>
                Explore more
            </button>


        </div>
    )
}

export default QuizResult;