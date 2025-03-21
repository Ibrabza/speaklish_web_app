import {FC} from "react";
import VoiceAnimation from "@/components/VoiceAnimation/VoiceAnimation.tsx";
import {useDispatch, useSelector} from "react-redux";
import {
    setCurrentPart,
    setShowPartComplete
} from "@/Features/Speaking/speakingSlice.ts";
import {AppDispatch, RootState} from "@/Store/store.ts";


const PartComplete : FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const currentPart = useSelector((state : RootState) => state.speaking.currentPart);

    function handleOnNext (){
        const newPart = currentPart + 1;
        dispatch(setCurrentPart(newPart));
        dispatch(setShowPartComplete(false));
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow text-center mb-8">
            <div className="w-full h-48 pt-3 pb-10 flex justify-center">
                <VoiceAnimation scale={1}/>
            </div>
            <p className="text-gray-600">
                Now let’s move to the Part {currentPart + 1}.
                You have 1 minute to prepare and 2 minutes for your speech.
            </p>
            <button
                onClick={handleOnNext}
                className="mt-4 px-4 py-2 bg-green-400 text-white rounded-lg"
            >
                Start Part {currentPart + 1}
            </button>
        </div>
    )
}

export default PartComplete;