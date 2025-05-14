import { useRef, useState } from "react";
import ReactPlayer from "react-player";

const CustomVideoPlayer = ({ src }: { src: string }) => {
    const playerRef = useRef<ReactPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => setIsPlaying((prev) => !prev);
    const toggleMute = () => setIsMuted((prev) => !prev);

    const handleFullscreen = () => {
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
            // iOS Safari fallback
            (containerRef.current as any).webkitRequestFullscreen();
        } else {
            alert("Fullscreen not supported in this environment.");
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-md mx-auto bg-black aspect-video overflow-hidden rounded-lg"
        >
            <ReactPlayer
                ref={playerRef}
                url={src}
                playing={isPlaying}
                muted={isMuted}
                controls={false}
                width="100%"
                height="100%"
                playsinline
            />

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center bg-black/60 text-white py-2">
                <button onClick={togglePlay} className="px-4 py-1">
                    {isPlaying ? "Pause ⏸" : "Play ▶️"}
                </button>
                <button onClick={toggleMute} className="px-4 py-1">
                    {isMuted ? "Unmute 🔊" : "Mute 🔇"}
                </button>
                <button onClick={handleFullscreen} className="px-4 py-1">
                    Fullscreen ⛶
                </button>
            </div>
        </div>
    );
};

export default CustomVideoPlayer;
