import styles from "./DownloadFile.module.css";
import { FC } from "react";
import { postEvent } from '@telegram-apps/sdk';


interface IDownloadFile {
    fileName: string;
    link: string;
}

const DownloadFile: FC<IDownloadFile> = ({ fileName, link }) => {
    const downloadFromServer = async () => {
        postEvent('web_app_request_file_download',{ url: link,file_name: fileName })
        console.log(link)
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