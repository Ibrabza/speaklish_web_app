import {FC} from "react";

import styles from "./UserGreating.module.css"
import {StarIcon} from "./StarIcon.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import {NavLink} from "react-router-dom";

const UserGreating: FC = () => {

    const first_name = useSelector( (state: RootState) => state.user.first_name)

    return (
        <NavLink to={"/test/home/history"} className={styles.container}>
            <div className={styles.user_info}>
                <h3>Hello, user</h3>
                <h2>{first_name}</h2>
            </div>
            <div className={styles.score}>
                <p>Mock score <span className={styles.percentage}>30%</span></p>
                <h2>
                    <span className={styles.star}>{<StarIcon/>}</span>
                    <span className={styles.lastband}>8.5</span>
                </h2>
            </div>
        </NavLink>
    )
}

export default UserGreating;