import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";


function formattedQuestionTxt(question_txt: string) {
    return question_txt.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
}

const Question: FC = () => {
    const currentQuestion = useSelector( (state:RootState) => state.speaking.currentQuestion)
    const loading = useSelector( (state: RootState) => state.speaking.loading)

    if (loading) return <Loading/>;

    return (
        <div className="text-lg text-gray-800 mb-4 text-left">
            <p>{formattedQuestionTxt(currentQuestion?.question_txt ?? "")}</p>
        </div>
    );
};

export default Question;
