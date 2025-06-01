import {FC, useCallback, useEffect, useState} from "react";
import styles from "./Quiz.module.css";
// import ConfirmButton from "@/components/ConfirmButton/ConfirmButton.tsx";
import QuizButton from "@/Features/Quiz/QuizButton/QuizButton.tsx";
import QuizOption from "@/Features/Quiz/QuizOption/QuizOption.tsx";
import Timer from "@/components/Timer/Timer.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";
import {handleGetQuiz, setCurrentIndex, submitAnswer} from "@/Features/Quiz/quizSlice.ts";
import toast from "react-hot-toast";
import {useNavigate, useParams} from "react-router-dom";
import { mainButton } from '@telegram-apps/sdk-react';



const versions = ['A', 'B', 'C', 'D'];


const Quiz : FC = () => {
    const [ answer, setAnswer] = useState<string>("")
    const { error, loading, quizzes, currentIndex } = useSelector( (state : RootState ) => state.quiz)
    const answers = useSelector( (state : RootState) => state.quiz.answers)
    const navigate = useNavigate()
    const {id : lesson_id} = useParams();
    const textForButton = (currentIndex+1) === quizzes?.length ? "Submit" : "Confirm";

    const dispatch = useDispatch<AppDispatch>();

    const handleConfirm = useCallback(() => {
        console.log("confirm")
        if(!answer) return;

        dispatch(submitAnswer({
            quiz_id: quizzes![currentIndex].id,
            answer: answer,
        }))
        if( currentIndex+1 === quizzes?.length) {
            // dispatch(setLoading(true))
            if(answers.length+1 !== quizzes!.length){
                toast.error("You should answer every question!")
                console.log("You should answer every question!")
                return;
            }
            navigate(`/app/lessons/quiz/result/${lesson_id}`)
        }
    },[answer, answers.length, currentIndex, dispatch, lesson_id, navigate, quizzes])

    useEffect(() => {
        mainButton.mount()
        mainButton.setParams({
            isEnabled:true,
            isVisible:true,
            text: textForButton,
            textColor: "#FFFFFF",
            backgroundColor: "#07DA83"
        })

        return () => {
            mainButton.setParams({
                isEnabled: false,
                isVisible: false,
            })
        }


    }, [textForButton]);

    useEffect(() => {
        mainButton.onClick(handleConfirm);

        return () => mainButton.offClick(handleConfirm);
    }, [handleConfirm]);

    useEffect(() => {
        dispatch(handleGetQuiz({lesson_id:Number(lesson_id)}))
    }, [lesson_id,dispatch]);

    useEffect(() => {
        if(answers.length && quizzes){
            if(answers.map(item => item.quiz_id).includes(quizzes[currentIndex]?.id)){
                const answered = answers.filter( item => item.quiz_id === quizzes[currentIndex]?.id);
                console.log(answered)
                setAnswer(answered[0].answer)
            }else{
                setAnswer("")
            }
        }
    }, [quizzes, answers, currentIndex]);

    const handleNavButton = (val:number) => {
        if(val + currentIndex === quizzes!.length || val + currentIndex+1 === 0){
            toast.error("NO more questions")
        }else {
            dispatch(setCurrentIndex(currentIndex + val));
        }
    }

    if(loading && !quizzes) return <Loading/>
    if(error) {
        console.log(error)
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.quiz_header}>
                <p className={styles.quiz_question_index}>
                    {currentIndex+1} / {quizzes && quizzes.length}
                </p>
            </div>

            <div className={styles.quiz_main}>
                <div className={styles.quiz_timer}>
                    <QuizButton onClick={ () => handleNavButton(-1)} type={"LEFT"}/>
                    <Timer/>
                    <QuizButton onClick={() => handleNavButton(+1)} type={"RIGHT"} />
                </div>

                <div className={styles.quiz_questions}>
                    <h3>{quizzes && quizzes[currentIndex]?.question}</h3>
                    <ul>
                        {quizzes && quizzes[currentIndex]?.options.map( (item,i) => <li
                            className={ answer === versions[i] ? "bg-grey-150 text-gray-50 " : "" }
                            key={i}>
                            <QuizOption clicked={answer === versions[i]} onClick={() => setAnswer(versions[i])} question={item}/>
                        </li>)}
                    </ul>
                </div>
            </div>


            {/*<ConfirmButton handler={handleConfirm} text={(currentIndex+1) === quizzes?.length ? "Submit" : "Confirm"}/>*/}
        </div>
    )
}

export default Quiz;