import {FC} from "react";

import styles from "./MaskGroup.module.css"
import mask1 from "./../../../assets/Container.png"
import mask2 from "./../../../assets/Mask-group1.png"

const MaskGroup:FC = () => {
    return <div className={styles.container}>
        <ul>
            <li key={"1312"}>
                <img src={mask1} alt={"speaklish1"}/>
            </li>
            <li key={"1112"}>
                <img src={mask2} alt={"speaklish2"}/>
            </li>
        </ul>
    </div>
}

export default MaskGroup;