import {FC, useState} from "react";
import {useDispatch} from "react-redux";
import PartTitle from "@/Features/Speaking/PartTitle.tsx";
import SpeakingTest from "@/Pages/Speaking/SpeakingTest/SpeakingTest.tsx";
import {Toaster} from "react-hot-toast";
import BackButton from "@/components/ui/BackButton.tsx";
import {AppDispatch} from "@/Store/store.ts";
import {handleCreateSession} from "@/Features/Speaking/speakingSlice.ts";

const Speaking: FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const dispatch = useDispatch<AppDispatch>();


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
        <div className={"max-w-[400px] mx-auto overflow-y-scroll h-dvh bg-gray-50  px-2"}>
            <div className={""}>
                <BackButton/>
            </div>
            <PartTitle/>
            <SpeakingTest handleGetMicro={handleGetMicro} handleGetSessionData={handleGetSessionData} stream={stream}/>
            <Toaster position="top-center"/>

        </div>
    )
}

export default Speaking;