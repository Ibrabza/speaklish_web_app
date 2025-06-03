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

const Auth :FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthorized, error, loading } = useSelector((state: RootState) => state.user);
    const initDataRef = React.useRef('');
    const initDataRaw = useRawLaunchParams();
    const navigate = useNavigate();

    const localAccess = localStorage.getItem("token");
    const localRefresh = localStorage.getItem("refresh_token");

    useEffect(() => {
        if (!localAccess && !localRefresh) {
            const initData = `#${initDataRaw}`;
            initDataRef.current = initData;

            console.log('Auth initData:', initData);

            dispatch(handleAuth({
                initData,
                password: "2025",
                username: "speaklish_user",
            }));

            dispatch(getGroupData());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    useEffect(() => {
        if (isAuthorized) {
            navigate("/app");
        } else if (error) {
            console.log('Auth error detected:', error);
            console.log('Redirecting to register with initData:', initDataRef.current);
            navigate(`/register${initDataRef.current}`);
        }
    }, [isAuthorized, error, navigate]);

    const handleClick = () => {
        navigate('/app');
    };

    const textToButton = !isAuthorized ? "Not authorized yet" : "Continue";

    return (
        <div className={" h-dvh text-green-800"}>
            <div className={" h-dvh bg-gray-50 w-dvw flex flex-col items-center gap-4 justify-center "}>
                <div className=" flex flex-col items-center gap-5">
                    {(loading && !error) ? <>
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"/>
                            <span className={"text-sm font-medium text-gray-700"}>
                        Authorizing checking...
                    </span>
                        </>
                        :
                        <>
                            <GrStatusGood color={'green'} size={40}/>
                            <span>
                        Authorized
                    </span>

                        </>
                    }
                    {/*<label className={"text-2xl font-medium"} htmlFor='phoneNumber'>Enter phone number</label>*/}
                    {/*<input className={"text-center py-3 px-3 block border-1 overflow-hidden border-solid border-black rounded-3xl"} placeholder={"(00)-000-00-00"} value={tel} onChange={(e) => setTel(e.target.value)} name="phoneNumber" type="tel"  />*/}
                </div>
                {isAuthorized &&
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