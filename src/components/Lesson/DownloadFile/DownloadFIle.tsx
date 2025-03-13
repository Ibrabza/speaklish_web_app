import styles from "./DownloadFile.module.css";
import { FC } from "react";

interface IDownloadFile {
    fileName: string;
    link: string;
}

const DownloadFile: FC<IDownloadFile> = ({ fileName, link }) => {
    return (
        <a href={link} download className={styles.container}>
            <div className={styles.lesson_action__button}>
                <img src="/lesson2/folder.svg" alt="folder" />
                <label>{fileName}</label>
            </div>
            <img src="/lesson2/download.svg" alt="speaklish-icon-download" />
        </a>
    );
};

export default DownloadFile;
