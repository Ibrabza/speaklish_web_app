import {FC} from "react";
import styles from "./Lesson.module.css"
import MeetingIcon from "../../assets/icons/shared/MeetingIcon.png"
import BackButton from "@/components/ui/BackButton.tsx";
import CallIcon from "@/assets/icons/shared/CalIcon.tsx";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer.tsx";
import {Link} from "react-router-dom";

const Lesson: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.backButton}>
                <BackButton/>
            </div>
            <h2 className={styles.lesson_title}>Lesson 1</h2>
            <div className={styles.lesson_main}>
                <div className={styles.lesson_date}>
                    <div className={styles.date_from}>
                        <h3>From</h3>
                        <div className={styles.date_date}>
                            <p>08.09.2025</p>
                            <CallIcon/>
                        </div>
                    </div>
                    <div className={styles.date_to}>
                        <h3>To</h3>
                        <div className={styles.date_date}>
                            <p>09.09.2025</p>
                            <CallIcon/>
                        </div>
                    </div>
                </div>
                <div className={styles.lesson_video}>
                    <VideoPlayer link={"https://www.youtube.com/watch?v=okMw2NpowSY"}/>
                </div>
                <div className={styles.lesson_meetingLink}>
                    <div className={styles.meeting}>
                        <img src={MeetingIcon} alt={"google-meeting"}/>
                        <span>Meeting with Teacher</span>
                    </div>
                    <span>&#8599;</span>
                </div>
                <div className={styles.lesson_description}>
                    <h3>Lecture</h3>
                    <p>Public speaking is more than just delivering words; it’s an art form that connects you with your audience, conveys your ideas with clarity, and inspires action. Whether you’re addressing a small team or a large conference, effective speaking can boost your confidence.</p>
                </div>
                <div className={styles.lesson_action__block}>
                    <h3>Attached Files</h3>
                    <div className={styles.lesson_action}>
                        <div className={styles.lesson_action__button}>
                            <img src={"/lesson2/folder.svg"} alt={"folder"}/>
                            <label htmlFor={"homework"}>HOMEWORK.pdf</label>
                            {/*<input name={"homework"} type={"file"}/>*/}
                        </div>
                        <img src={"/lesson2/download.svg"} alt={"speaklish-icon-download"}/>
                    </div>
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

                <div className={styles.lesson_action__block}>
                    <h3>Pronunciation Task</h3>
                    <div className={styles.lesson_action}>
                        <div className={styles.lesson_action__button}>
                            <img src={"/lesson2/ai-mic.svg"} alt={"speaklish-ai-micro"}/>
                            <span>Pronunciation </span>
                        </div>
                        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>
                    </div>
                </div>

                <div className={styles.lesson_action__block}>
                    <h3>Speak about topic</h3>
                    <div className={styles.lesson_action}>
                        <div className={styles.lesson_action__button}>
                            <img src={"/lesson2/audio-book.svg"} alt={"speaklish-audio-book"}/>
                            <span>Speak </span>
                        </div>
                        <img src={"/lesson2/arrow.svg"} alt={"speaklish-arrow"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lesson;