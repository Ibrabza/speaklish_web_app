import {FC} from "react";

import styles from "./NewItem.module.css"

const NewItem: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.image}></div>
            <div className={styles.info_block}>
                <h2 className={styles.info_title}>Don't miss it!</h2>
                <p>Today on Speaklish, there is amazing news—don't miss it!</p>
                <h3>Start <span>&#8599;</span></h3>
            </div>
        </div>
    )
}

export default NewItem;