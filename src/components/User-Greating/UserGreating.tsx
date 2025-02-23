import {FC} from "react";

import styles from "./UserGreating.module.css"
import {StarIcon} from "./StarIcon.tsx";

const UserGreating: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.user_info}>
                <h3>Hello, user</h3>
                <h2>Bobirjon</h2>
            </div>
            <div className={styles.score}>
                <p>Mock score <span className={styles.percentage}>30%</span></p>
                <h2>
                    <span className={styles.star}>{<StarIcon/>}</span>
                    <span className={styles.lastband}>8.5</span>
                </h2>
            </div>
        </div>
    )
}

export default UserGreating;