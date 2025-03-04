
import {useState} from "react";
import WelcomePage from "./WelcomePage.jsx";
import QuestionCompound from "./QuestionCompound.jsx";
import {useSelector} from "react-redux";
import PartCompleteMessage from "./PartCompleteMessage.jsx";
import ExamResultScreen from "./ExamResultScreen.jsx";
import Loading from "../ui/Loading.jsx";
import {RootState} from "@/Store/store.ts";

export default function SpeakingTest({handleGetSessionData, handleGetMicro, stream }) {

    const [showWelcome, setShowWelcome] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const showPartComplete = useSelector((state : RootState) => state.session.showPartComplete);
    const currentPart = useSelector((state : RootState) => state.session.currentPart);
    const loading = useSelector(((state : RootState) => state.session.loading));

    if(loading) return <Loading/>

    if(showWelcome) return <WelcomePage
        onStartTest={() => setShowWelcome(false)}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleGetSessionData={handleGetSessionData}
        handleGetMicro={handleGetMicro}
    />


    return (
        <div className=" max-w-md mx-auto min-h-full p-4 bg-gray-50">
            {showPartComplete ? <PartCompleteMessage /> : (
                currentPart === 4 ? <ExamResultScreen setShowWelcome={setShowWelcome} />
                    : <QuestionCompound showWelcome={showWelcome} showConfirmation={showConfirmation} stream={stream} />
            )}
        </div>
    )
}