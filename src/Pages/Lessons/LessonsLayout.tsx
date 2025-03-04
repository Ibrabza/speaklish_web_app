import {Outlet} from "react-router-dom";

import styles from "./LessonsLayout.module.css"


const LessonsLayout = () => {
    return (
        <div className={styles.lessonsLayout}>
            <Outlet/>
        </div>
    )
}


export default LessonsLayout;