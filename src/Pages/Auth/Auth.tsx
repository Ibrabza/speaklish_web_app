import React, {FC, useEffect} from "react";
// import styles from "./Auth.module.css"
// import Loading from "@/components/ui/Loading.tsx";
import {useNavigate} from "react-router-dom";
import {GrStatusGood} from "react-icons/gr";
import Button1 from "@/components/ui/Button1.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {getGroupData, handleAuth} from "@/Features/User/userSlice.ts";


const Auth :FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const {isAuthorized, error, refresh, loading, access,} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!access && !refresh) {
            // Get the URL search params
            const searchParams = new URLSearchParams(window.location.search);
            // Check for tgWebAppData parameter
            const tgWebAppData = searchParams.get('tgWebAppData');

            // Use either the tgWebAppData from URL or the hash
            const initData = tgWebAppData ? `#tgWebAppData=${tgWebAppData}` : window.location.hash;

            // Store the initData in the ref for potential use in registration
            initDataRef.current = initData;

            console.log('Auth initData:', initData);

            // Dispatch auth action with the initData
            dispatch(handleAuth({
                initData: initData,
                password: "2025",
                username: "speaklish_user"
            }));

            // Get group data after authentication
            dispatch(getGroupData());
        }
    }, [access, dispatch, refresh])

    const navigate = useNavigate();

    function handleClick(){
        navigate('/app');
    }

    const textToButton = !isAuthorized ? "Not authorized yet" : "Continue"

    // Store the initData in a ref so we can use it for registration if needed
    const initDataRef = React.useRef('');

    useEffect(() => {
        // Check for any error when not authorized
        if (!isAuthorized && error) {
            console.log('Auth error detected:', error);
            // Log the error type and content for debugging
            console.log('Error type:', typeof error);
            console.log('Error content:', JSON.stringify(error));

            // Always redirect to register when there's an error and user is not authorized
            // This ensures we handle all error cases including 'User not found'
            console.log('Redirecting to register page with initData:', initDataRef.current);

            // Navigate to register page with initData as a query parameter
            navigate(`/app/register${initDataRef.current ? `?tgWebAppData=${encodeURIComponent(initDataRef.current.replace('#tgWebAppData=', ''))}` : ''}`);
        }
    }, [error, isAuthorized, navigate]);

    // Use useEffect for navigation instead of doing it during render
    useEffect(() => {
        if(!error && isAuthorized) {
            navigate("/app");
        }
    }, [error, isAuthorized, navigate]);
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