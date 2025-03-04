import {FC, useEffect} from "react";
import styles from "@/Features/Quiz/Quiz.module.css";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {setError, setTimer} from "@/Features/Quiz/quizSlice.ts";


const Timer :  FC = () => {

    const timer = useSelector( (state : RootState) => state.quiz.timer )

    const dispatch = useDispatch<AppDispatch>()

    if(timer === 0){
        dispatch(setError("Time is over !"));
    }

    useEffect(() => {
        if (timer > 0) {
            const ticTak = setTimeout(() => {
                dispatch(setTimer(timer - 1));
            }, 1000);

            return () => clearTimeout(ticTak);
        }
    }, [timer, dispatch]);

    const min = Math.trunc(timer/60);
    const sec = timer%60

    return (
        <div className={styles.quiz_timer__item}>
            {min}:{sec < 10 ? `0${sec}` : sec}
        </div>
    )
}

export default Timer;