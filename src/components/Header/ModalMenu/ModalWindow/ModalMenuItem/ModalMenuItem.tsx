import {FC, JSX} from "react";
import {NavLink} from "react-router-dom";

import styles from "./ModalMenuItem.module.css"

interface IModalMenuItemProps {
    icon: JSX.Element,
    text: string,
    to:string,
}
const ModalMenuItem : FC<IModalMenuItemProps> = (props) => {
    return (
        <li className={styles.link}>
            <NavLink to={props.to}>
                <div className={styles.content}>
                    <span className={styles.icon}>{props.icon}</span>
                    <span>{props.text}</span>
                </div>
            </NavLink>
        </li>
    )
}

export default ModalMenuItem;