import { FC } from "react";
import styles from "./AudioButton.module.css";

interface AudioButtonProps {
    isRecording: boolean;
    onClick: () => void;
    onTimerClick?: () => void; // New prop for timer click
    scale?: number;
    disabled?: boolean;
    timer?: { minutes: number, seconds: number };
    showTimer?: boolean;
}

const AudioButton: FC<AudioButtonProps> = ({ 
    isRecording, 
    onClick, 
    onTimerClick,
    scale = 1, 
    disabled = false,
    timer = { minutes: 0, seconds: 0 },
    showTimer = false
}) => {
    const formatTime = (time: { minutes: number, seconds: number }) => {
        return `${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
    };

    return (
        <button 
            className={`${styles.audioButton} ${isRecording ? styles.recording : ''} ${disabled ? styles.disabled : ''}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
            <div className={styles.innerCircle} style={{ transform: `scale(${scale})` }}>
                {isRecording && showTimer ? (
                    <span 
                        className={`${styles.timerDisplay} ${onTimerClick ? styles.clickableTimer : ''}`} 
                        onClick={(e) => {
                            if (onTimerClick) {
                                e.stopPropagation(); // Prevent triggering the button's onClick
                                onTimerClick();
                            }
                        }}
                    >
                        {formatTime(timer)}
                    </span>
                ) : isRecording ? (
                    <span className={styles.stopIcon}></span>
                ) : (
                    <span className={styles.micIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="currentColor"/>
                            <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                        </svg>
                    </span>
                )}
            </div>
        </button>
    );
};

export default AudioButton;