import {FC, useEffect, useState} from "react";
import styles from "./Pronunciation.module.css"
import BackButton from "@/components/ui/BackButton.tsx";
import DownloadIcon from "@/assets/icons/lesson/DownloadIcon.tsx";
import VoiceAnimation from "@/components/VoiceAnimation/VoiceAnimation.tsx";
// import useAudio from "@/hooks/useAudio.ts";

interface IPronunciation {
    audio?: string,
}

const Pronunciation: FC<IPronunciation> = () => {
    const [stream, setStream] = useState<MediaStream | null>(null)
    // const {audioUrl, scale, setAudioUrl} = useAudio(stream);

    useEffect(() => {
        const handleGetMIcro = async () => {
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
        handleGetMIcro();
    },[])

    console.log(stream)


    return (
        <div className={styles.container}>
            <div className={styles.pronunciation_header}>
                <BackButton/>
                <h3>Topic</h3>
                <DownloadIcon color={"#07DA83"} />
            </div>

            <div className={styles.pronunciation_main}>
                <div className={styles.pronunciation_text}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                    </p>
                </div>


                <div className={styles.pronunciation__button}>
                    <div className={styles.pronunciation_timer}>
                        <p>00:<br/>40</p>
                    </div>
                    <VoiceAnimation scale={3}/>
                </div>
            </div>


        </div>
    )
}

export default Pronunciation;