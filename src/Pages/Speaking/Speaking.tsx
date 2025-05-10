import {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PartTitle from "@/Features/Speaking/PartTitle.tsx";
import SpeakingTest from "@/Pages/Speaking/SpeakingTest/SpeakingTest.tsx";
import {Toaster} from "react-hot-toast";
// import BackButton from "@/components/ui/BackButton.tsx";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {handleCreateSession, setProgress} from "@/Features/Speaking/speakingSlice.ts";
import { backButton } from '@telegram-apps/sdk';
import {useNavigate} from "react-router-dom";
import ClosingConfirmWindow from "@/components/ClosingConfirmWIndow/ClosingConfirmWindow.tsx";
import {useNetworkStatus} from "@/hooks/useNetworkStatus.ts";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";



const Speaking: FC = () => {
    const isOnline = useNetworkStatus()
    const [isLeaving, setIsLeaving] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const inProgress = useSelector( (state: RootState) => state.speaking.inProgress);

    useEffect(() => {
        backButton.mount();
        backButton.show();

        const backHandler = () => handleBackClick();
        backButton.onClick(backHandler);

        return () => {
            backButton.offClick(backHandler);
            backButton.hide();
            backButton.unmount();
        };
    }, [navigate, dispatch, inProgress]);

    const handleBackClick = () => {
        console.log(inProgress)
        if(inProgress) {
            setIsLeaving(true)
        }else{
            navigate(-1)
        }
    }


    function handleGetSessionData(){
        // dispatch(getSessionData({user_id: 6616, is_test: true}))
        dispatch(handleCreateSession())
    }

    async function handleGetMicro(){
        if (window.isSecureContext) {
            console.log("Safe and secure")
        }

        if (navigator.mediaDevices) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setStream(mediaStream);
                console.log(mediaStream);
            } catch (error) {
                console.error("Error accessing the microphone:", error);
            }
        } else {
            console.log("getUserMedia not supported");

        }
    }
    const handleLeaveSpeaking = () => {
        dispatch(setProgress(false))
        navigate(-1)
    }
    
    if(!isOnline) return <ErrorPage message={"No Internet connection. Please check your connection"} onClick={() => navigate("/auth")} button={"Retry"}/>

    return (
        <div className={"w-dvw relative mx-auto overflow-y-scroll h-dvh bg-gray-50"}>
            {isLeaving && <div className={"fixed inset-0 flex items-center justify-center bg-black/50 z-20"}>
                <ClosingConfirmWindow
                    func={handleLeaveSpeaking}
                    onCancel={() => setIsLeaving(false)}
                    isInProgress={true}/>
            </div>
            }
            {inProgress && <PartTitle/>}
            <SpeakingTest handleGetMicro={handleGetMicro} handleGetSessionData={handleGetSessionData} stream={stream}/>
            <Toaster position="top-center"/>

        </div>
    )
}

export default Speaking;