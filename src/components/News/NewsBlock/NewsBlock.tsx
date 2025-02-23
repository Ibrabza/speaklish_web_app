import {FC} from "react";

import styles from "./NewsBlock.module.css"
import NewItem from "../NewItem/NewItem.tsx";

const NewsBlock: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.scrolling}>
                <NewItem/>
            </div>
        </div>
    )
}

export default NewsBlock;