import {Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import {useEffect} from "react";

import styles from "./LessonsLayout.module.css"

const LessonsLayout = () => {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthorized);
    
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
    }, []);

    function handler() {
        window.open("https://t.me/mySpeaky_bot", "_self")
        window.close()
    }

    if(!isAuthenticated) return <ErrorPage message={"You are not authenticated"} button={"Go back to Telegram"} onClick={handler}/>

    return (
        <div className={styles.lessonsLayout}>
            <Outlet/>
        </div>
    )
}

export default LessonsLayout;