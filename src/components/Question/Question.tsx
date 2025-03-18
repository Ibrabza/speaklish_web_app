import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";



interface IQuestion {
    category? : string,
    id: number,
    mobile_voice_url?: string,
    question_txt : string,
    voice_url?: string,
}

// Function to properly format the text with line breaks
function formattedQuestionTxt(question_txt: string) {
    return question_txt.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
}

const Question: FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(null);

    const { loading, currentPart, currentQuestionIndex, questions } = useSelector(
        (state: RootState) => state.session
    );

    const partKey = `part${currentPart}` as keyof typeof questions;

    const questionSet: IQuestion[] | IQuestion | undefined = questions?.[partKey];
    console.log(partKey, questionSet,questions)
    // const question = p`part2` ? questionSet![currentQuestionIndex] : questionSet  ?? null;
    const question = (currentPart === 2 ? questionSet : questionSet?.[currentQuestionIndex]) ?? null;

    console.log(currentPart, questions)

    useEffect(() => {
        setCurrentQuestion(question);
    }, [question]);

    if (loading || !questions) return <Loading/>;

    return (
        <div className="text-lg text-gray-800 mb-4 text-left">
            <p>{formattedQuestionTxt(currentQuestion?.question_txt ?? "")}</p>
        </div>
    );
};

export default Question;
