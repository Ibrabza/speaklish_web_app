
import LottieAnimation from "../ui/VoiceAnimation.jsx";
import animationData from "/src/assets/animation/animation.json"
import ModalWindow from "../ui/ModalWindow.jsx";
import {useDispatch} from "react-redux";
import {setCurrentPart} from "../../Slices/sessionSlice.js";

const WelcomePage = ({handleGetSessionData, handleGetMicro, onStartTest, showConfirmation, setShowConfirmation }) => {
    const dispatch = useDispatch();


    const handleStartClick = async () => {
        await handleGetMicro()
        setShowConfirmation(true);
    };
    const handleConfirmStart = () => {
        setShowConfirmation(false);
        handleGetSessionData();
        onStartTest('speaking');
        dispatch(setCurrentPart(1));
    };


    return (
        <div className=" max-w-md mx-auto min-h-full gap-5 pt-40 bg-gray-50 flex flex-col items-center justify-center">

            {/* Logo and Title */}
            <div className="mb-8 text-center">
                <h1 className="text-xl font-semibold text-gray-800 mb-1">IELTS Speaking Mock AI</h1>
                <div className="flex items-center justify-center">
                    <span className="bg-yellow-300 text-xs text-gray-800 font-medium px-2 py-0.5 rounded-full mr-2">Demo</span>
                    <button className="text-gray-500">
                        <i className="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>

            {/* Image */}
            <div className="mb-8 flex justify-center flex-col items-center">
                <LottieAnimation animationData={animationData} scale={1}/>
                <p className="text-center text-gray-600 mt-4 text-sm">
                    Once you press the "Start" button, the exam session will start and it will take 15~20 minutes. Please
                    don’t get distracted during this time.
                </p>
            </div>

            {/* Powered by text */}
            <div className="mb-8 text-center">
                <p className="text-xs text-gray-500">Powered by <span className="text-green-600 font-semibold">Speaklish</span></p>
            </div>

            {/* Start Button */}
            <button
                onClick={handleStartClick}
                className="w-full max-w-xs py-4 bg-primary text-white rounded-full font-medium text-lg hover:bg-green-600 transition"
            >
                Start
            </button>

            {showConfirmation && (
                <ModalWindow text={"Are you ready to start? It will take 15~20 minutes."}
                             buttons={["No", "Yes"]}
                             handleClose={() => setShowConfirmation(false)}
                             handler={handleConfirmStart}/>
            )}
        </div>
    );
};

export default WelcomePage;
