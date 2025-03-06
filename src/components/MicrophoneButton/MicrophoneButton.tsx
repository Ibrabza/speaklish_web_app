import { Mic, Pause } from "lucide-react";
import { FC } from "react";

interface IMButton {
    isRecording: boolean;
    setIsRecording: (isRecording: boolean | ((prev: boolean) => boolean)) => void;
}

const MicrophoneButton: FC<IMButton> = ({ isRecording, setIsRecording }) => {
    const handleClick = () => {
        setIsRecording((prev) => !prev);
    };

    return (
        <button
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors 
            ${isRecording ? 'bg-red-500' : 'bg-green-400'} text-white mx-auto py-4`}
            onClick={handleClick}
        >
            {isRecording ? <Pause size={24} /> : <Mic size={24} />}
        </button>
    );
};

export default MicrophoneButton;
