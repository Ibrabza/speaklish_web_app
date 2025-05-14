import {FC, JSX} from "react";
import { useNavigate} from "react-router-dom";

import styles from "./ModalMenuItem.module.css"
import toast from "react-hot-toast";
import { FaSpinner} from 'react-icons/fa';

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
                toast(() => (
                    <div className="flex items-start w-full gap-3">
                        <FaSpinner className="animate-spin text-blue-500 mr-3" />
                        <div>
                            <p className="font-semibold">In process of development</p>
                        </div>
                    </div>
                ), {
                    icon: null,
                    duration: 3000,
                    position: "top-center"
                });
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