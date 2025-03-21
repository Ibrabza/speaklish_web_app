import {FC, useEffect, useState} from "react";
import VoiceAnimation from "@/components/VoiceAnimation/VoiceAnimation.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import Question from "@/components/Question/Question.tsx";
import MicrophoneButton from "@/components/MicrophoneButton/MicrophoneButton.tsx";
import AudioReview from "@/components/AudioReview/AudioReview.tsx";
import NextQuestionButton from "@/components/Speaking/NextQuestionButton/NextQuestionButton.tsx";
import {makeBlob} from "@/Helpers/helper.ts";
import toast from "react-hot-toast";
import useAudio from "@/hooks/useAudio.ts";
import {
    setCurrentPart,
    setCurrentQuestionIndex,
    setShowPartComplete, submitPart
} from "@/Features/Speaking/speakingSlice.ts";

interface IQCompound {
    stream: MediaStream | null,
    showWelcome: boolean,
    showConfirmation: boolean,
}


const QuestionCompound : FC<IQCompound> = (props) => {
    const dispatch = useDispatch<AppDispatch>();

    const {stream, showWelcome, showConfirmation} = props;

    const [recordingStartTime, setRecordingStartTime] = useState(0);
    const [countdown, setCountdown] = useState(120);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const { loading, id,  currentQuestion, currentQuestionIndex, currentPart, partLength} = useSelector( (state:RootState) => state.speaking)

    const [isRecording, setIsRecording] = useState(false);

    const [isQuestionPlaying, setIsQuestionPlaying] = useState(true);

    const {audioUrl, scale, setAudioUrl} = useAudio({
        stream,
        isRecording,
        setIsRecording,
        currentPart,
        setRecordingStartTime
    });

    function handleMicroTrue () {
        setIsQuestionPlaying(false)
    }

    useEffect(() => {
        if (!isRecording || !recordingStartTime) return;

        const durationInterval = setInterval(() => {
            setRecordingDuration(Date.now() - recordingStartTime);
        }, 100);

        return () => clearInterval(durationInterval);
    }, [isRecording, recordingStartTime]);

    useEffect(() => {
        if (showWelcome || loading || showConfirmation || !currentQuestion) return;

        const audioUrl = currentQuestion.mobile_voice_url.startsWith("https://api")
            ? currentQuestion.mobile_voice_url
            : `https://dashboard.speaklish.uz${currentQuestion.mobile_voice_url}`;

        const audio = new Audio(audioUrl);
        let silentAudio : HTMLAudioElement;

        const playAudio = async () => {
            try {
                silentAudio = new Audio();
                silentAudio.srcObject = stream;
                silentAudio.muted = true;
                silentAudio.play();

                await audio.play();

                audio.addEventListener("ended", handleMicroTrue)
                console.log("Audio started playing");
            } catch (error) {
                console.error("Error playing audio:", error);
            }
        };

        playAudio().then(() => {
            console.log("Audio playing finished");
        });

        return () => {
            console.log("Cleaning up audio...");
            audio.pause();
            audio.src = "";
            audio.removeEventListener("ended", handleMicroTrue);
            if (silentAudio) {
                silentAudio.pause();
                silentAudio.src = "";
            }
        };
    }, [stream, showWelcome, currentQuestion, showConfirmation, loading]);

    useEffect(() => {
        if (currentPart === 2) {
            setCountdown(120);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        dispatch(setCurrentPart(3));
                        dispatch(setCurrentQuestionIndex(0));
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [dispatch, currentPart]);

    const handleNext = async () => {
        if (recordingDuration < 4000){
            toast.error("Please record your response for at least 4 seconds. (" + Math.floor(recordingDuration / 1000) + " seconds)");
            return;
        }
        try{
            if( audioUrl && currentQuestion){
                dispatch(submitPart({part: currentPart, question_id: currentQuestion.id, session_id: id, audio: await makeBlob(audioUrl)}));

                setAudioUrl(null);
                setRecordingDuration(0);
                setRecordingStartTime(0);

                if(currentPart <= 3 && currentQuestionIndex < partLength){
                    if(currentPart !== 2){
                        if( partLength - 1 >  currentQuestionIndex ){
                            dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
                        }else{
                            dispatch(setShowPartComplete(true))
                        }
                    }else{
                        dispatch(setShowPartComplete(true))
                    }
                }else{
                    dispatch(setCurrentPart(4))
                }
            }

        }catch (error){
            console.log(error)
            return error;
        }

    }



    return (
        <>
            <div className="mb-8 bg-white p-6 rounded-lg shadow text-center">
                {currentPart === 2 && (
                    <div className="text-gray-600 text-xl font-semibold mb-2">
                        {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                        {String(countdown % 60).padStart(2, '0')}
                    </div>
                )}
                <div className="max-w-md h-48 flex flex-col items-center justify-center mb-8">
                    <VoiceAnimation scale={isRecording ? scale * 1.5 + 1 : 1.5}/>
                </div>

                <Question/>

                {!isQuestionPlaying && <MicrophoneButton  isRecording={isRecording} setIsRecording={setIsRecording} />}

                {audioUrl && <AudioReview audioUrl={audioUrl} />}
            </div>
            <NextQuestionButton disabled={(recordingDuration < 4000)} onClick={handleNext}/>
        </>
    )
}

export default QuestionCompound;