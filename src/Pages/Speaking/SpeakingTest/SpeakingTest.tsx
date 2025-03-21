import {FC, useState} from "react";
import WelcomePage from "@/Pages/Speaking/WelcomePage/WelcomePage.tsx";
import PartComplete from "@/Pages/Speaking/PartComplete/PartComplete.tsx";
import ExamResult from "@/Pages/Speaking/ExamResult/ExamResult.tsx";
import {RootState} from "@/Store/store.ts";
import {useSelector} from "react-redux";
import QuestionCompound from "@/Pages/Speaking/QuestionCompound/QuestionCompound.tsx";
// import Loading from "@/components/Loading.tsx";



interface ISTest {
    handleGetSessionData: () => void,
    handleGetMicro: () => void,
    stream: MediaStream | null,
}

const SpeakingTest : FC<ISTest> = ({handleGetSessionData, handleGetMicro, stream }) => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const showPartComplete = useSelector((state : RootState) => state.speaking.showPartComplete);
    const currentPart = useSelector((state : RootState) => state.speaking.currentPart);
    // const loading = useSelector((state) => state.session.loading);

    // if(loading) return <Loading/>

    if(showWelcome) return <WelcomePage
        onStartTest={() => setShowWelcome(false)}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleGetSessionData={handleGetSessionData}
        handleGetMicro={handleGetMicro}
    />

    return (
        <div className=" max-w-md mx-auto min-h-full p-4 bg-gray-50">
            {showPartComplete ? <PartComplete /> : (
                currentPart === 4 ? <ExamResult setShowWelcome={setShowWelcome} />
                    : <QuestionCompound showWelcome={showWelcome} showConfirmation={showConfirmation} stream={stream} />
            )}
        </div>
    )
}


export default SpeakingTest;