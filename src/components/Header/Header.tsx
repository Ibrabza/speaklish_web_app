import {FC} from "react";

import styles from "./Header.module.css"
import MaskGroup from "./MaskGroup/MaskGroup.tsx";
import ModalMenu from "./ModalMenu/ModalMenu.tsx";

const Header: FC = () =>{
    return(
        <div className={styles.container}>
            <header className={styles.header}>
                <MaskGroup/>
                <ModalMenu/>
            </header>
        </div>
    )
}

export default Header;