import {FC, useState} from "react";
import styles from "./ModalMenu.module.css"
import ModalWindow from "./ModalWindow/ModalWindow.tsx";
import {useClickOutside} from "@/hooks/useClickOutside.ts";

const ModalMenu:FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const modalRef = useClickOutside<HTMLDivElement>(handleCloseModalWindow)

    function handleCloseModalWindow(){
        setIsMenuOpen(false)
        // console.log("closed")
    }

    return (
        <div className={styles.container}>
            {!isMenuOpen && <button onClick={() => {setIsMenuOpen(true)}} className={styles.el} />}
            {isMenuOpen && <ModalWindow onClose={handleCloseModalWindow} ref={modalRef}/> }
        </div>
    )
}


export default ModalMenu;