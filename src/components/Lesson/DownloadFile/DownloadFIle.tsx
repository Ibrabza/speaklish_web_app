import styles from "./DownloadFile.module.css";
import { FC, useEffect } from "react";

interface IDownloadFile {
    fileName: string;
    link: string;
}

const DownloadFile: FC<IDownloadFile> = (props) => {
    useEffect(() => {
        const downloadFile = async () => {
            try {
                const response = await fetch(props.link, {
                    mode: "cors", // Ensure CORS is allowed
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", props.fileName); // Force download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Revoke the object URL after download
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Download failed:", error);
            }
        };

        if (props.link) {
            downloadFile();
        }
    }, [props.link, props.fileName]);

    return (
        <div className={styles.container}>
            <div className={styles.lesson_action__button}>
                <img src={"/lesson2/folder.svg"} alt={"folder"} />
                <label htmlFor={"homework"}>{props.fileName}</label>
            </div>
            <img src={"/lesson2/download.svg"} alt={"speaklish-icon-download"} />
        </div>
    );
};

export default DownloadFile;
