import styles from "./DownloadFile.module.css";
import { FC } from "react";

interface IDownloadFile {
    fileName: string;
    link: string;
}

const DownloadFile: FC<IDownloadFile> = ({ fileName, link }) => {
    const downloadFromServer = async () => {
        try {
            const response = await fetch(link);

            if (!response.ok) {
                throw new Error("Error loading the file");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `File`; // Имя сохраняемого файла
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading", error);
        }
    };

    return (
        <div onClick={downloadFromServer} className={styles.container}>
            <div className={styles.lesson_action__button}>
                <img src="/lesson2/folder.svg" alt="folder" />
                <label>{fileName}</label>
            </div>
            <img src="/lesson2/download.svg" alt="speaklish-icon-download" />
        </div>
    );
};

export default DownloadFile;
