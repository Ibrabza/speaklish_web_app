import {FC} from "react";

import styles from "./NewItem.module.css"

interface INews {
    title: string;
    content: string;
    image: string;
}

const NewItem: FC<INews> = (props) => {
    const { title , image, content} = props;
    return (
        <div className={styles.container}>
            <div className={styles.image}><img src={image} alt={"news"}/></div>
            <div className={styles.info_block}>
                <h2 className={styles.info_title}>{title}</h2>
                <p>{content}</p>
                <h3>Start <span>&#8599;</span></h3>
            </div>
        </div>
    )
}

export default NewItem;