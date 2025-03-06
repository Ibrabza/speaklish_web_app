import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store.ts";

interface QuestionType {
    question_txt: string;
    options?: string[];
    answer?: string;
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
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);

    const { loading, currentPart, currentQuestionIndex, questions } = useSelector(
        (state: RootState) => state.session
    );

    const partKey = `part${currentPart}` as keyof typeof questions;
    const questionSet: QuestionType[] | undefined = questions?.[partKey];
    const question = questionSet?.[currentQuestionIndex] ?? null;

    useEffect(() => {
        setCurrentQuestion(question);
    }, [question]);

    if (loading || !questions) return null;

    return (
        <div className="text-lg text-gray-800 mb-4 text-left">
            <p>{formattedQuestionTxt(currentQuestion?.question_txt ?? "")}</p>
        </div>
    );
};

export default Question;
