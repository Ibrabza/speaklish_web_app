
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";


export default function PartTitle() {

    const { loading, currentPart, currentQuestionIndex, questions} = useSelector((state : RootState) => state.session);
    const questionSet = questions[`part${currentPart}`];

    if (loading && currentPart === 0) return null;

    if(currentPart === 0) return;

    return (
        <div className="mb-8 px-5 mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
                {currentPart === 4 ? " " : `IELTS Speaking Part ${currentPart}`}
            </h1>
            <div className="mt-2 h-2 bg-purple-200 rounded-full">
                <div
                    className="h-2 bg-primary rounded-full transition-all duration-300"
                    style={{
                        width: `${((currentQuestionIndex + 1) / questionSet?.length) * 100}%`
                    }}
                />
            </div>
        </div>
    )
}