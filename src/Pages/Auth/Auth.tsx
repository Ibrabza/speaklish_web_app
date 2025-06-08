import React, {FC, useEffect} from "react";
// import styles from "./Auth.module.css"
// import Loading from "@/components/ui/Loading.tsx";
import {useNavigate} from "react-router-dom";
import {GrStatusGood} from "react-icons/gr";
import Button1 from "@/components/ui/Button1.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {getGroupData, handleAuth} from "@/Features/User/userSlice.ts";
import { useRawLaunchParams } from '@telegram-apps/sdk-react';
import {getAccessToken, getRefreshToken} from "@/services/authService.ts";

const Auth :FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthorized, error, loading } = useSelector((state: RootState) => state.user);
    const user = useSelector((state: RootState) => state.user);
    const initDataRef = React.useRef('');
    const initDataRaw = useRawLaunchParams();
    const navigate = useNavigate();

    const localAccess = getAccessToken();
    const localRefresh = getRefreshToken();
    const isAuthenticated = localStorage.getItem("isAuthorized");

    console.log('user info', user)

    console.log(initDataRaw)

    useEffect(() => {
        if (isAuthenticated && !error && !loading) {
            navigate("/app");
        }
    }, [isAuthenticated, error, loading, navigate]);

    useEffect(() => {
        if (!localAccess || !localRefresh || !isAuthenticated) {
            const initData = `#${initDataRaw}`;
            initDataRef.current = initData;

            console.log('Auth initData:', initData);

            dispatch(handleAuth({
                initData,
                password: "2025",
                username: "speaklish_user",
            }));
        }
    }, []);

    useEffect(() => {
        if (isAuthorized || isAuthenticated) {
            dispatch(getGroupData());
        }
    }, [isAuthenticated, isAuthorized, dispatch]);

    useEffect(() => {
        if (isAuthorized && !isAuthenticated || (error && !loading)) {
            console.log('Auth error detected:', error);
            console.log('Redirecting to register page with initData:', initDataRef.current);
            navigate(`/register/${initDataRef.current}`);
        }
    }, [error, isAuthenticated, loading, navigate]);



    const handleClick = () => {
        navigate('/app');
    };

    const textToButton = !isAuthenticated ? "Not authorized yet" : "Continue";

    return (
        <div className={" h-dvh text-green-800"}>
            <div className={" h-dvh bg-gray-50 w-dvw flex flex-col items-center gap-4 justify-center "}>
                <div className=" flex flex-col items-center gap-5">
                    {loading ? (
                        <>
                            <div className="animate-spin ..."/>
                            <span className="...">Authorizing...</span>
                        </>
                    ) : error ? (
                        <>
                            <span className="text-red-500">Authorization failed.</span>
                        </>
                    ) : isAuthenticated ? (
                        <>
                            <GrStatusGood color={'green'} size={40}/>
                            <span>Authorized</span>
                        </>
                    ) : (
                        <>
                            <span>Not authorized</span>
                        </>
                        )
                    }
                </div>
                {isAuthenticated &&
                    <Button1
                        className={"px-4 py-2 flex items-center bg-primary text-black rounded-lg disabled:bg-gray-400"}
                        disabled={!isAuthorized}
                        onClick={handleClick}
                        text={textToButton}
                    />
                }
            </div>
        </div>
    )
}

export default Auth;