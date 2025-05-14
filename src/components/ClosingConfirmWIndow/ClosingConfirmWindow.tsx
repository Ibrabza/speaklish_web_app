import {FC} from "react";
import styles from "./ClosingConfirmWIndow.module.css"
import SadLogo from "@/assets/SadLogo.tsx";

interface IClosingConfirmWindow {
    func : () => void,
    onCancel : () => void,
    isInProgress: boolean,
}


const ClosingConfirmWindow: FC<IClosingConfirmWindow> = (props) => {


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <SadLogo width={53} height={53}/>
                <h3>Are you sure?</h3>
                {props.isInProgress ? <p>Your answers will not be saved if you leave nov</p> : <p>You are leaving the App</p> }
            </div>
            <div className={styles.buttons}>
                <button className={styles.exit} onClick={props.func}>Exit</button>
                <button className={styles.cancel} onClick={props.onCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default ClosingConfirmWindow;