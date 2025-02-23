import {FC} from "react";
import styles from "./BackButton.module.css";
import {useNavigate} from "react-router-dom";

const BackButton: FC = () => {
    const navigate = useNavigate();

    function handleClick(){
        navigate(-1);
    }

    return (
        <div onClick={handleClick} className={styles.container}>&larr;</div>
    )
}

export default BackButton;