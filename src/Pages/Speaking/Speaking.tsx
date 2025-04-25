import {FC, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import PartTitle from "@/Features/Speaking/PartTitle.tsx";
import SpeakingTest from "@/Pages/Speaking/SpeakingTest/SpeakingTest.tsx";
import {Toaster} from "react-hot-toast";
// import BackButton from "@/components/ui/BackButton.tsx";
import {AppDispatch} from "@/Store/store.ts";
import {handleCreateSession} from "@/Features/Speaking/speakingSlice.ts";
import { backButton } from '@telegram-apps/sdk';
import {useNavigate} from "react-router-dom";
import ClosingConfirmWindow from "@/components/ClosingConfirmWIndow/ClosingConfirmWindow.tsx";



const Speaking: FC = () => {
    const [isLeaving, setIsLeaving] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        backButton.mount()
        backButton.show()
        backButton.onClick(() => {
            setIsLeaving(true)
        })

        return () => {
            backButton.hide()
            backButton.unmount()
        }
    }, []);


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

    return (
        <div className={"w-dvw relative mx-auto overflow-y-scroll h-dvh bg-gray-50"}>
            {isLeaving && <div className={"fixed inset-0 flex items-center justify-center bg-black/50 z-20"}>
                <ClosingConfirmWindow
                    func={() => navigate(-1)}
                    onCancel={() => setIsLeaving(false)}
                    isInProgress={true}/>
            </div>
            }
            <PartTitle/>
            <SpeakingTest handleGetMicro={handleGetMicro} handleGetSessionData={handleGetSessionData} stream={stream}/>
            <Toaster position="top-center"/>

        </div>
    )
}

export default Speaking;