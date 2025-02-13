
import styles from "./NavigateButton.module.css"
import {FC, ReactNode} from "react";

interface IProps {
    children: ReactNode,
    isActive: boolean,
}

const NavigateButton: FC<IProps> = (props) => {
    return (
        <div className={props.isActive ? styles.containerActive : styles.container}>
                {props.children}
        </div>
    )
}

export default NavigateButton;