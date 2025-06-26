import {FC, useEffect} from "react";
import styles from "./Lesson.module.css"
import MeetingIcon from "../../assets/icons/shared/MeetingIcon.png"
import CallIcon from "@/assets/icons/shared/CalIcon.tsx";
// import VideoPlayer from "@/components/VideoPlayer/VideoPlayer.tsx";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {handleGetLesson} from "@/Features/User/userSlice.ts";
import Loading from "@/components/Loading.tsx";
import DownloadFIle from "@/components/Lesson/DownloadFile/DownloadFIle.tsx";
import MultilineDropdown from "@/components/Lesson/MultilineDropdown";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer.tsx";
// const CustomVideoPlayer = lazy(() => import('@/components/VideoPlayer/CustomVideoPlayer'));

const Lesson: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { id: lessonId} = useParams()

    const state = useSelector( (state: RootState) => state.user.lesson)
    // const playerRef = useRef(null);

    // const videoJsOptions = {
    //     autoplay: true,
    //     controls: true,
    //     responsive: true,
    //     fluid: true,
    //     sources: [
    //         {
    //             src: 'video.mp4',
    //             type: 'video/mp4',
    //         },
    //     ],
    // };

    // const handlePlayerReady = (player) => {
    //     playerRef.current = player;
    //
    //     player.on('waiting', () => {
    //         console.log('Player is waiting');
    //     });
    //
    //     player.on('dispose', () => {
    //         console.log('Player will dispose');
    //     });
    // };


    useEffect( () => {
        dispatch(handleGetLesson({lesson_id: Number(lessonId)}))
    },[dispatch,lessonId])

    console.log(state)

    if(!state) return <Loading/>


    return (
        <div className={styles.container}>
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
                    {state.video && state.video.trim() ? (
                        <VideoPlayer link={state.video}/>
                        //     <CustomVideoPlayer options={videoJsOptions} onReady={handlePlayerReady}/>
                    ) : (
                        <div
                            className="flex items-center justify-center min-h-[180px] rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-base font-medium border border-dashed border-gray-300 dark:border-gray-700 p-4"
                            role="status"
                            aria-live="polite"
                            tabIndex={0}
                            aria-label="No video available for this class"
                        >
                            This class does not have video
                        </div>
                    )}
                </div>
                <a href={state.meeting_link} className={styles.lesson_meetingLink}>
                    <div className={styles.meeting}>
                        <img src={MeetingIcon} alt={"google-meeting"}/>
                        <span>Meeting with Teacher</span>
                    </div>
                    <span>&#8599;</span>
                </a>
                <div className={styles.lesson_description}>
                    <MultilineDropdown label="Lecture" text={state.description || ''} className={styles.lesson_dropdown} />
                </div>
                <div className={styles.lesson_action__block}>
                    <h3>Attached Files</h3>
                    {state!.files!.map((item,i) => <DownloadFIle fileName={`File ${i+1}`} link={`https://dashboard.speaklish.uz${item.url}`}/>)}
                </div>

                <div className={styles.lesson_action__block}>
                    <h3>Quizzes</h3>
                    <Link to={`/app/lessons/quiz/${state.id}`} className={styles.lesson_action}>
                        <div className={styles.lesson_action__button}>
                            <img src={"/lesson2/ai-idea.svg"} alt={"quiz"}/>
                            <span>Check your knowledge</span>
                        </div>
                        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>
                    </Link>
                </div>


                <div className={styles.lesson_action__block}>
                    <h3>Pronunciation Task</h3>
                    <Link to={`/app/lessons/pronunciation/${lessonId}`} className={styles.lesson_action}>
                        <div className={styles.lesson_action__button}>
                            <img src={"/lesson2/ai-mic.svg"} alt={"speaklish-ai-micro"}/>
                            <span>Pronunciation Practice</span>
                        </div>
                        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Lesson;