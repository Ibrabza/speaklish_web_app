import { FC, useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";
import animaData from "../../assets/animation/animation.json";

interface IVAnimation {
    scale: number;
}

const VoiceAnimation: FC<IVAnimation> = ({ scale }) => {
    const animationContainerRef = useRef<HTMLDivElement | null>(null);
    const animationInstanceRef = useRef<AnimationItem | null>(null);

    useEffect(() => {
        if (animationContainerRef.current) {
            animationInstanceRef.current = lottie.loadAnimation({
                container: animationContainerRef.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animaData,
            });
        }

        return () => {
            animationInstanceRef.current?.destroy();
        };
    }, []);

    return (
        <div
            ref={animationContainerRef}
            style={{
                zIndex: 0,
                transform: `scale(${scale})`,
                transition: "transform 0.1s ease-out", // Smooth scaling
                maxWidth: "100px", // Default width
                maxHeight: "100px", // Default height
            }}
        />
    );
};

export default VoiceAnimation;
