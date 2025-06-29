import { forwardRef } from "react";
import styles from "./ModalWindow.module.css";
import ModalMenuItem from "./ModalMenuItem/ModalMenuItem.tsx";
import {editIcon as EditIcon} from "../../../../assets/icons/modalMenu/edit-02.tsx"
import { GroupIcon } from "@/assets/icons/modalMenu/group.tsx"
import { UploadIcon as LogOutIcon } from "../../../../assets/icons/modalMenu/upload.tsx"
import { WalletIcon } from "@/assets/icons/modalMenu/wallet-done-02.tsx"
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";

interface IModalWindowProps {
    onClose?: () => void;
}

const ModalWindow = forwardRef<HTMLDivElement, IModalWindowProps>((props,ref) => {
    const groupName = useSelector( (state : RootState) => state.user.group.name)
    const request_balance = useSelector( (state : RootState) => state.user.request_balance)

    return (
        <>
            <div className={styles.container}>

            </div>
            <div ref={ref}
                 className={styles.menu}>
                <button onClick={props.onClose} className={styles.closeButton}>&times;</button>
                <ul>
                    <ModalMenuItem to={'edit-profile'} icon={<EditIcon/>} text={"Edit profile"} key={1}/>
                    <ModalMenuItem to={'log-out'} icon={<LogOutIcon/>} text={"Log out"} key={2}/>
                    <ModalMenuItem to={'group'} icon={<GroupIcon/>} text={groupName} key={3}/>
                    <ModalMenuItem to={'request-balance'} icon={<WalletIcon/>} text={`Request balance ${request_balance}`} key={4}/>
                </ul>
            </div>
        </>
    );
});

export default ModalWindow;
