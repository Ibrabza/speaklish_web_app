import {FC} from "react";

import styles from "./NewItem.module.css"
import NewsWindow from "@/components/NewsWindow/NewsWindow.tsx";

interface INews {
    title: string;
    content: string;
    image: string;
    showWindow: number | string,
    id: number | string,
    func: (id: number | string) => void,
}

const NewItem: FC<INews> = (props) => {
    const { title , image, content, id, showWindow} = props;

    if(showWindow === id){
        return <NewsWindow func={props.func} title={title} description={content} image={image}/>
    }

    return (
        <div className={styles.container}>
            <div className={styles.image}><img src={image} alt={"news"}/></div>
            <div className={styles.info_block}>
                <h2 className={styles.info_title}>{title}</h2>
                <p>{content}</p>
                <h3 onClick={() => props.func(id)}>More <span>&#8599;</span></h3>
            </div>
        </div>
    )
}

export default NewItem;