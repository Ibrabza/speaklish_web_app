
import styles from "./ErrorPage.module.css"
import {FC} from "react";

interface IErrorPage {
    message: string,
    button? : string,
    onClick?: () => void,
}


const ErrorPage : FC<IErrorPage> = (props) => {
    return (
        <div className={styles.container}>
            <img src={"/erro.svg"} alt={"speaklish error"}/>
            <p>{props.message}</p>
            {props.button && <button className={styles.error_button} onClick={props.onClick}>{props.button}</button>}
        </div>
    )
}


export default ErrorPage;