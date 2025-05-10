
import styles from "./ErrorPage.module.css"
import {FC} from "react";
import {useNavigate} from "react-router-dom";
import SadLogo from "@/assets/SadLogo.tsx";

interface IErrorPage {
    message: string,
    button? : string,
    onClick?: () => void,
}


const ErrorPage : FC<IErrorPage> = (props) => {
    const navigate = useNavigate();

    const toHomePage = () => {
        navigate("/auth");
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <SadLogo width={150} height={150} />
            </div>
            <p>{props.message}</p>
            {props.button && <button className={styles.error_button} onClick={props.button === "Go to homepage" ? toHomePage : props.onClick}>{props.button}</button>}
        </div>
    )
}


export default ErrorPage;