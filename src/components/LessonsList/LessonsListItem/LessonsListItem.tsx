import {FC} from "react";
import styles from "./LessonsListItem.module.css"
import {NavLink} from "react-router-dom";
import OpenIcon from "@/assets/icons/icon/OpenIcon.tsx";
import BlockIcon from "@/assets/icons/icon/BlockIcon.tsx";

type Tdate = number | string;

interface ILessonsItem {
    index: number;
    to: string,
    title: string,
    date: Tdate,
    status: boolean,

}

const LessonsListItem: FC<ILessonsItem> = (props) =>{

    if(!props.status) return (
        <div className={styles.container}>
            <h2>{props.index}.<span>{props.title}</span></h2>
            <div className={styles.rcontainer}>
                <p>{props.date}</p>
                <div className={styles.icon}>{props.status ? <OpenIcon/> : <BlockIcon/>}</div>
            </div>
        </div>
    )

    return (
        <NavLink to={props.to}>
            <div className={styles.container}>
                <h2>{props.index}.<span>{props.title}</span></h2>
                <div className={styles.rcontainer}>
                    <p>{props.date}</p>
                    <div className={styles.icon}>{props.status ? <OpenIcon/> : <BlockIcon/> }</div>
                </div>
            </div>
        </NavLink>
    )
}

export default LessonsListItem;