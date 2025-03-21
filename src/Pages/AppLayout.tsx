import {Outlet} from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons/NavigationButtons.tsx";

import styles from "./AppLayout.module.css"
import Header from "../components/Header/Header.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import {useEffect} from "react";

const AppLayout = () => {

    const isAuthenticated = useSelector( (state: RootState) => state.user.isAuthorized);

    useEffect(() => {
        // Check if Telegram WebApp is available before expanding
        if (window.Telegram?.WebApp?.expand) {
            try {
                window.Telegram.WebApp.expand();
                console.log('Telegram WebApp expanded');
            } catch (error) {
                console.error('Error expanding Telegram WebApp:', error);
            }
        } else {
            console.log('Telegram WebApp expand function not available');
        }
    }, []);


    function handler() {
        // window.location.href = "https://t.me/@mySpeaky_bot";
        window.open("https://t.me/mySpeaky_bot", "_self")
    }

    if(!isAuthenticated) return <ErrorPage message={"You are not authenticated"} button={"Go back to Telegram"} onClick={handler}/>

    return (
        <div className={styles.layout}>
            <Header/>
            <div className={styles.content}>
                <Outlet />
            </div>
            <NavigationButtons/>
        </div>
    )
}

export default AppLayout;