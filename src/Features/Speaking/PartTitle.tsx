
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import {ISessionState} from "@/Features/Speaking/speakingSlice.ts";


export default function PartTitle() {

    const { loading, currentPart, currentQuestionIndex } = useSelector( (state: RootState) => state.speaking)
    const partKey = `part${currentPart}` as keyof Pick<ISessionState, "part1" | "part2" | "part3">;
    const questions = useSelector( (state: RootState) => state.speaking[partKey]);

    if (loading && currentPart === 0 || !questions) return null;
    if(currentPart === 0) return;

    return (
        <div className=" px-5 mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
                {currentPart === 4 ? " " : `IELTS Speaking Part ${currentPart}`}
            </h1>
            <div className="mt-2 h-2 bg-purple-200 rounded-full">
                <div
                    className="h-2 bg-green-400 rounded-full transition-all duration-300"
                    style={{
                        width: `${((currentQuestionIndex + 1) / (Array.isArray(questions) ? questions.length : 2)) * 100}%`
                    }}
                />
            </div>
        </div>
    )
}