import {FC} from "react";

import styles from "./ConfirmButton.module.css"

interface ICButton {
    handler : () => void,
    text: string,
}



const ConfirmButton: FC<ICButton> = (props) => {

    return (
        <button className={styles.container} onClick={props.handler}>{props.text}</button>
    )
}

export default ConfirmButton;