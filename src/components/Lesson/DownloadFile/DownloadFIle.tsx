import styles from "./DownloadFile.module.css"
import {FC} from "react";

interface IDownloadFile {
    fileName: string,
    link: string,
}

const DownloadFIle : FC<IDownloadFile> = (props) => {
    return (
        <a href={props.link} download className={styles.container}>
            <div className={styles.lesson_action__button}>
                <img src={"/lesson2/folder.svg"} alt={"folder"}/>
                <label htmlFor={"homework"}>{props.fileName}</label>
            </div>
            <img src={"/lesson2/download.svg"} alt={"speaklish-icon-download"}/>
        </a>
    )
}


export default DownloadFIle;