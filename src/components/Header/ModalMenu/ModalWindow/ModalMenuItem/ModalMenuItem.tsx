import {FC, JSX} from "react";
import { useNavigate} from "react-router-dom";

import styles from "./ModalMenuItem.module.css"
import toast from "react-hot-toast";

interface IModalMenuItemProps {
    icon: JSX.Element,
    text: string,
    to:string,
}
const ModalMenuItem : FC<IModalMenuItemProps> = (props) => {
    const navigate = useNavigate();
    return (
        <li className={styles.link}>
            <div onClick={() => {
                toast.error("In process of development")
                navigate("/auth")
            }}>
                <div className={styles.content}>
                    <span className={styles.icon}>{props.icon}</span>
                    <span>{props.text}</span>
                </div>
            </div>
        </li>
    )
}

export default ModalMenuItem;