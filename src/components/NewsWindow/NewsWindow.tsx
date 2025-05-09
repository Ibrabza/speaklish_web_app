import {FC} from "react";

import styles from "./NewsWindow.module.css"
import {useClickOutside} from "@/hooks/useClickOutside.ts";

interface INewsWindow {
    title: string;
    description: string;
    link?: string;
    image?: string;
    func: (id: number | string) => void,
}

const NewsWindow : FC<INewsWindow> = (props) => {
    const windowRef = useClickOutside<HTMLDivElement>(()=> props.func(""))

    const {image, description: content, title} = props
    return <div className={styles.mainContainer}>
        <div className={styles.container} ref={windowRef}>
            <div className={styles.image}><img src={image} alt={"news"}/></div>
            <div className={styles.info_block}>
                <h2 className={styles.info_title}>{title}</h2>
                <p>{content}</p>
                <button onClick={() => props.func("")}>Close</button>
            </div>
        </div>
    </div>
}

export default NewsWindow;