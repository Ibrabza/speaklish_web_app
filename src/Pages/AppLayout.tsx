import {Outlet} from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons/NavigationButtons.tsx";

import styles from "./AppLayout.module.css"
import Header from "../components/Header/Header.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import {useEffect} from "react";
import {Toaster} from "react-hot-toast";
import {handleReload} from "@/Features/User/userSlice.ts";

const AppLayout = () => {

    const isAuthenticated = useSelector( (state: RootState) => state.user.isAuthorized);
    const first_name = useSelector((state : RootState )=> state.user.first_name);
    const dispatch = useDispatch<AppDispatch>()


    useEffect(() => {
        if(isAuthenticated && !first_name){
            dispatch(handleReload())
        }
    }, [isAuthenticated, first_name, dispatch]);

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
        window.close()
    }

    if(!isAuthenticated) return <ErrorPage message={"You are not authenticated"} button={"Go back to Telegram"} onClick={handler}/>

    return (
        <div className={styles.layout}>
            <Header/>
            <div className={styles.content}>
                <Outlet />
            </div>
            <NavigationButtons/>
            <Toaster position={"top-center"}/>
        </div>
    )
}

export default AppLayout;