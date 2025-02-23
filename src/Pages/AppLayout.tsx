import {Outlet} from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons/NavigationButtons.tsx";

import styles from "./AppLayout.module.css"
import Header from "../components/Header/Header.tsx";

const AppLayout = () => {
    return (
        <div className={styles.layout}>
            <Header/>
            <div className={styles.content}>
                <Outlet />
            </div>
            <NavigationButtons/>
        </div>
    )
}

export default AppLayout;