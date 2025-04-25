import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import {useEffect} from "react";

import styles from "./LessonsLayout.module.css"
import {Toaster} from "react-hot-toast";
import {backButton} from "@telegram-apps/sdk";

const LessonsLayout = () => {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthorized);
    const navigate = useNavigate();
    const {id: lesson_id } = useParams();
    
    useEffect(() => {
        // Check if Telegram WebApp is available before expanding
        if (window.Telegram?.WebApp?.expand) {
            try {
                window.Telegram.WebApp.expand();
                console.log('Telegram WebApp expanded in LessonsLayout');
            } catch (error) {
                console.error('Error expanding Telegram WebApp:', error);
            }
        } else {
            console.log('Telegram WebApp expand function not available');
        }

    }, [navigate,lesson_id]);

    useEffect(() => {
        backButton.mount()
        backButton.show()
        backButton.onClick(() => {
            navigate("/app/home")
        })

        return () => {
            backButton.hide()
            backButton.unmount()
        }
    }, [lesson_id, navigate]);

    function handler() {
        window.open("https://t.me/mySpeaky_bot", "_self")
        window.close()
    }

    if(!isAuthenticated) return <ErrorPage message={"You are not authenticated"} button={"Go back to Telegram"} onClick={handler}/>

    return (
        <div className={styles.lessonsLayout}>
            <Toaster position={"top-center"}/>
            <Outlet/>
        </div>
    )
}

export default LessonsLayout;