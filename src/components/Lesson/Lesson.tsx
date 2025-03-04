import {FC, useEffect} from "react";
import styles from "./Lesson.module.css"
import MeetingIcon from "../../assets/icons/shared/MeetingIcon.png"
import BackButton from "@/components/ui/BackButton.tsx";
import CallIcon from "@/assets/icons/shared/CalIcon.tsx";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer.tsx";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {handleGetLesson} from "@/Features/User/userSlice.ts";
import Loading from "@/components/Loading.tsx";
import DownloadFIle from "@/components/Lesson/DownloadFile/DownloadFIle.tsx";

const Lesson: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { id: lessonId} = useParams()

    const state = useSelector( (state: RootState) => state.user.lesson)

    useEffect( () => {
        dispatch(handleGetLesson({lesson_id: Number(lessonId)}))
    },[dispatch,lessonId])

    console.log(state)

    if(!state) return <Loading/>

    return (
        <div className={styles.container}>
            <div className={styles.backButton}>
                <BackButton/>
            </div>
            <h2 className={styles.lesson_title}>{state.title}</h2>
            <div className={styles.lesson_main}>
                <div className={styles.lesson_date}>
                    <div className={styles.date_from}>
                        <h3>From</h3>
                        <div className={styles.date_date}>
                            <p>{state.start_date}</p>
                            <CallIcon/>
                        </div>
                    </div>
                    <div className={styles.date_to}>
                        <h3>To</h3>
                        <div className={styles.date_date}>
                            <p>{state.end_date}</p>
                            <CallIcon/>
                        </div>
                    </div>
                </div>
                <div className={styles.lesson_video}>
                    <VideoPlayer link={state.video}/>
                </div>
                <a href={state.meeting_link} className={styles.lesson_meetingLink}>
                    <div className={styles.meeting}>
                        <img src={MeetingIcon} alt={"google-meeting"}/>
                        <span>Meeting with Teacher</span>
                    </div>
                    <span>&#8599;</span>
                </a>
                <div className={styles.lesson_description}>
                    <h3>Lecture</h3>
                    <p>{state.description}</p>
                </div>
                <div className={styles.lesson_action__block}>
                    <h3>Attached Files</h3>
                    {state!.files!.map((item,i) => <DownloadFIle fileName={`File ${i+1}`} link={`https://dashboad.speaklish.uz/${item.url}`}/>)}
                </div>

                <div className={styles.lesson_action__block}>
                    <h3>Quizzes</h3>
                    <Link to={'/test/lessons/quiz/1'} className={styles.lesson_action}>
                        <div className={styles.lesson_action__button}>
                            <img src={"/lesson2/ai-idea.svg"} alt={"quiz"}/>
                            <span>Check your knowledge</span>
                        </div>
                        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>
                    </Link>
                </div>


                {/* in progress need to develop*/}
                {/*<div className={styles.lesson_action__block}>*/}
                {/*    <h3>Pronunciation Task</h3>*/}
                {/*    <div className={styles.lesson_action}>*/}
                {/*        <div className={styles.lesson_action__button}>*/}
                {/*            <img src={"/lesson2/ai-mic.svg"} alt={"speaklish-ai-micro"}/>*/}
                {/*            <span>Pronunciation </span>*/}
                {/*        </div>*/}
                {/*        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className={styles.lesson_action__block}>*/}
                {/*    <h3>Speak about topic</h3>*/}
                {/*    <div className={styles.lesson_action}>*/}
                {/*        <div className={styles.lesson_action__button}>*/}
                {/*            <img src={"/lesson2/audio-book.svg"} alt={"speaklish-audio-book"}/>*/}
                {/*            <span>Speak </span>*/}
                {/*        </div>*/}
                {/*        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default Lesson;