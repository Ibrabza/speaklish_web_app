import {FC} from "react";
import styles from "./BackButton.module.css";
import {useNavigate} from "react-router-dom";

interface IBBtn{
    to?: string;
    handler?: () => void;
}

const BackButton: FC<IBBtn> = (props) => {
    const navigate = useNavigate();

    function handleClick(){
        const newTo = props.to || -1
        navigate(newTo as string);
    }

    return (
        <div onClick={props.handler || handleClick} className={styles.container}>&larr;</div>
    )
}

export default BackButton;