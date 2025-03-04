import styles from "./QuizReview.module.css"
import {FC} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import BackButton from "@/components/ui/BackButton.tsx";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import QuestionReview from "@/Pages/Quiz/QuizReview/ReviewItem/QuestionReview.tsx";


const QuizReview: FC = () => {
    const result = useSelector( (state : RootState) => state.quiz?.result?.answers);

    if(!result) return <ErrorPage message={"Answers to review are not found"}/>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <BackButton/>
            </div>
            <ul className={styles.questions}>
                {result.map((qs,i) => <li key={qs.id}>
                    <QuestionReview
                        index={i+1}
                        question={qs.question}
                        right_answer={qs.correct_answer}
                        questions={qs.options}
                        user_answer={qs.user_answer}/>
                </li>)}
            </ul>
        </div>
    )
}

export default QuizReview;