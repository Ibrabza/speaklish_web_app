import {FC, useState} from "react";
import {getSessionData} from "@/Features/Speaking/Session/sessionSlice.ts";
import {useDispatch} from "react-redux";
import PartTitle from "@/Features/Speaking/PartTitle.tsx";

const Speaking: FC = () => {
    const [stream, setStream] = useState(null);
    const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(getSessionData({user_id: 6616, is_test: true}))
    // }, [dispatch]);

    function handleGetSessionData(){
        dispatch(getSessionData({user_id: 6616, is_test: true}))
    }

    async function handleGetMicro(){
        if (window.isSecureContext) {
            console.log("Safe and secure")
        }

        if (navigator.mediaDevices) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setStream(mediaStream);
                // stream.current = mediaStream;
                console.log(mediaStream);
            } catch (error) {
                console.error("Error accessing the microphone:", error);
            }
        } else {
            console.log("getUserMedia not supported");

        }
    }

    return (
        <div className={"max-w-md mx-auto h-dvh  overflow-y-hidden"}>
            <PartTitle/>
            {/*<TestComponent handleGetSessionData={handleGetSessionData} handleGetMicro={handleGetMicro} stream={stream}/>*/}
            {/*<Toaster position="top-right"/>*/}

        </div>
    )
}

export default Speaking;