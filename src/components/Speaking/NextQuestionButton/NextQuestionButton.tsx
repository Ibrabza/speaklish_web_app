import {ChevronRight} from "lucide-react";
import {FC} from "react";

interface INQButton {
    onClick: () => void;
    disabled?: boolean;
}


const NextQuestionButton :FC<INQButton> = (props) => {
    return (
        <div className="flex justify-between">
            <button className={"px-4 py-2 flex items-center bg-primary text-white rounded-lg disabled:bg-gray-400"}
                    onClick={props.onClick} disabled={props.disabled}>
                Next
                <ChevronRight size={20} className="ml-1"/>
            </button>
        </div>
    )
}

export default NextQuestionButton;