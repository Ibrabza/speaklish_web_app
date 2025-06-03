import { FC } from "react";

import styles from "./HistoryItem.module.css"
import CallIcon from "@/assets/icons/shared/CalIcon.tsx";


interface IHistoryItem {
    name?: string;
    id: string | number;
    date: string;
    score: number;
    func: (id:string | number) => void;
}


const HistoryItem : FC<IHistoryItem> = (props) => {

    return (
        <div className={styles.container} onClick={() => props.func(props.id)}>
            <h3>{props.name ? props.name : "Speaking"}</h3>
            <div className={styles.dataBlock}>
                <div className={styles.date}>
                    <span>{props.date}</span>
                    <CallIcon/>
                </div>
                <div className={styles.score}>
                    {props.score.toFixed(1)}
                </div>
            </div>
        </div>
    )
}

export default HistoryItem;