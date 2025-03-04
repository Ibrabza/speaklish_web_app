import {FC} from "react";

import styles from "./MaskGroup.module.css"
import mask1 from "./../../../assets/Container.png"
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";

const MaskGroup:FC = () => {

    const photo_url = useSelector( (state: RootState) => state.user.photo_url)

    return <div className={styles.container}>
        <div className={styles.images}>
            <div className={styles.fimg}>
                <img src={mask1} alt={"speaklish1"}/>
            </div>
            <div className={styles.simg}>
                <img src={photo_url} alt={"speaklish2"}/>
            </div>
        </div>
    </div>
}

export default MaskGroup;