import {FC, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {
    resetSpeaking,
    setCurrentPart,
    setCurrentQuestionIndex,
    setShowPartComplete
} from "@/Features/Speaking/speakingSlice.ts"
import {handleGetResult} from "@/Features/Speaking/speakingSlice.ts";

interface IExamResult {
    setShowWelcome : (x:boolean) => void;
}

const ExamResult : FC<IExamResult> = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const {setShowWelcome} = props;

    const {id, feedbackResponse , loading, error} = useSelector( (state: RootState) => state.speaking)
    const results = useSelector( (state:RootState) => state.speaking.feedbackResponse?.results)
    const result = results?.[results?.length - 1]

    // const [isLoading, setIsLoading] = useState(true);

    const handleGoToHomepage = () => {
        setShowWelcome(true);

        dispatch(setCurrentPart(0));
        dispatch(setCurrentQuestionIndex(0));
        dispatch(setShowPartComplete(false));
        dispatch(resetSpeaking())
    };

    console.log(loading, feedbackResponse)

    useEffect(() => {
        dispatch(handleGetResult({id}))

    }, [id,dispatch]);

    if (loading || !feedbackResponse) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
            </div>
        );
    }

    if (!loading && !results || error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">{error || "No exam results available."}</p>
            </div>
        );
    }

    console.log(results);



    return (
        <div className="max-w-md mx-auto p-4 min-h-screen bg-gray-50 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Results</h1>

            {/* Band Score */}
            <div className="bg-purple-100 w-full max-w-xs rounded-lg p-6 mb-6 text-center">
                <p className="text-lg font-medium text-green-400">Band score</p>
                <p className="text-4xl font-bold text-green-500 mt-2">
                    {result?.band_score || 'N/A'}
                </p>
            </div>

            {/* Individual Scores */}
            <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs text-center">
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Fluency</p>
                    <p className="text-lg font-bold text-green-500">
                        {result?.fluency || 'N/A'}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Vocabulary</p>
                    <p className="text-lg font-bold text-green-500">
                        {result?.vocabulary || 'N/A'}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Grammar</p>
                    <p className="text-lg font-bold text-green-500">
                        {result?.grammar || 'N/A'}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Pronunciation</p>
                    <p className="text-lg font-bold text-green-500">
                        {result?.pronunciation || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="text-left w-full max-w-xs mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Feedback</h2>
                <p className="text-sm text-gray-600 mt-2">
                    {result?.feedback || 'No feedback available.'}
                </p>
            </div>

            {/* Go to Homepage Button */}
            <button
                onClick={handleGoToHomepage}
                className="w-full max-w-xs py-3 bg-green-400 text-white rounded-full font-medium text-lg hover:bg-green-500 transition"
            >
                Go to Homepage
            </button>
        </div>
    )
}

export default ExamResult;