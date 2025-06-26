import { FC } from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import {useClickOutside} from "@/hooks/useClickOutside.ts";


interface IRScreen {
    id: string | number;
    func: (id: string | number) => void;
}


const ResultScreen : FC<IRScreen> = (props) => {
    const result = useSelector( (state: RootState) => state.user.history!.results!.filter( (item) => item.id === props.id)[0])
    const windowRef = useClickOutside<HTMLDivElement>(() => props.func(""))
    console.log(result)

    if (!result) {
        return (
            <div ref={windowRef} className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">{ "No exam results available."}</p>
            </div>
        );
    }

    console.log(result);



    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-20">

            <div ref={windowRef} className="w-[90%] rounded-[12px] mx-auto p-4 h-[90%] bg-gray-50 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Results</h1>

                <div className="bg-purple-100 w-full max-w-xs rounded-lg p-6 mb-6 text-center">
                    <p className="text-lg font-medium text-green-400">Band score</p>
                    <p className="text-4xl font-bold text-green-500 mt-2">
                        {result.band_score || 'N/A'}
                    </p>
                </div>

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

                <div className="text-left w-full max-w-xs mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Feedback</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        {result?.feedback || 'No feedback available.'}
                    </p>
                </div>

            <button className={" self-center bg-[#06c476] text-whitesmoke py-2  px-4  rounded-3xl flex"}
                    onClick={() => props.func("")}
            >
                Close
            </button>
            </div>
        </div>
    )
}

export default ResultScreen;