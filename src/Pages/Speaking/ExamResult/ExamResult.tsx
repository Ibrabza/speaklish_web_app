import {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {
    setCurrentPart,
    setCurrentQuestionIndex,
    setShowPartComplete
} from "@/Features/Speaking/Session/sessionSlice.ts";
import toast from "react-hot-toast";
import apiClient from "@/services/apiClient.ts";
import {API_ENDPOINTS} from "@/services/config.ts";

interface IExamResult {
    setShowWelcome : (x:boolean) => void;
}

const ExamResult : FC<IExamResult> = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const {setShowWelcome} = props;

    const [examResult, setExamResult] = useState<any>(null);
    const session = useSelector((state : RootState) => state.session.session);
    const [isLoading, setIsLoading] = useState(true);
    const sessionId = session?.session_id;
    const school_id = session?.user_id;

    const handleGoToHomepage = () => {
        setShowWelcome(true);
        dispatch(setCurrentPart(1));
        dispatch(setCurrentQuestionIndex(0));
        dispatch(setShowPartComplete(false));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 20000); // 10 seconds

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if(isLoading || !sessionId || !school_id) return;

        const fetchExamResult = async () => {
            try {
                // setIsLoading(true);
                // Fetch session feedback using the provided sessionId
                const response = await apiClient.get(`${API_ENDPOINTS.SESSION_FEEDBACK(sessionId,school_id.toString())}`);
                console.log(response?.data?.json_result);
                return response.data;
            } catch (err) {
                console.error('Failed to fetch exam result:', err);
                toast.error('Failed to fetch exam results');
            } finally {
                setIsLoading(false);
            }
        };


        if (!isLoading && sessionId) {
            fetchExamResult().then(response => setExamResult(response.json_result));
        }
    }, [isLoading,school_id,sessionId]);

    if (isLoading || Boolean(examResult?.msg)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isLoading && !examResult) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">No exam results available.</p>
            </div>
        );
    }

    console.log(examResult);



    return (
        <div className="max-w-md mx-auto p-4 min-h-screen bg-gray-50 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Results</h1>

            {/* Band Score */}
            <div className="bg-purple-100 w-full max-w-xs rounded-lg p-6 mb-6 text-center">
                <p className="text-lg font-medium text-green-400">Band score</p>
                <p className="text-4xl font-bold text-green-500 mt-2">
                    {examResult?.band_score || 'N/A'}
                </p>
            </div>

            {/* Individual Scores */}
            <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs text-center">
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Fluency</p>
                    <p className="text-lg font-bold text-green-500">
                        {examResult?.fluency || 'N/A'}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Vocabulary</p>
                    <p className="text-lg font-bold text-green-500">
                        {examResult?.vocabulary || 'N/A'}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Grammar</p>
                    <p className="text-lg font-bold text-green-500">
                        {examResult?.grammar || 'N/A'}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-lg py-4 border border-[#E7E7FF]">
                    <p className="text-sm text-gray-600">Pronunciation</p>
                    <p className="text-lg font-bold text-green-500">
                        {examResult?.pronunciation || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="text-left w-full max-w-xs mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Feedback</h2>
                <p className="text-sm text-gray-600 mt-2">
                    {examResult?.feedback || 'No feedback available.'}
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