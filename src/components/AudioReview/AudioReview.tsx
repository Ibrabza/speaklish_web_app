import { FC, useEffect, useState } from "react";

interface IAReview {
    audioUrl: string;
}

const AudioReview: FC<IAReview> = ({ audioUrl }) => {
    const [isSafari, setIsSafari] = useState<boolean>(false);

    useEffect(() => {
        if (typeof navigator !== "undefined") {
            const userAgent = navigator.userAgent;
            setIsSafari(/^((?!chrome|android).)*safari/i.test(userAgent));
        }
    }, []);

    const type = isSafari ? "audio/mp4" : "audio/mp4"; // Keeping the same type
    console.log(type)

    return (
        <div className="mt-4 w-full">
            <audio
                controls
                src={audioUrl}
                onLoadedMetadata={() => console.log("Audio metadata loaded")}
                className="w-full"
            />
        </div>
    );
};

export default AudioReview;
