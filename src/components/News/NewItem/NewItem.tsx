import {FC} from "react";

import styles from "./NewItem.module.css"
import NewsWindow from "@/components/NewsWindow/NewsWindow.tsx";
import {postEvent} from "@telegram-apps/sdk";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/Store/store.ts";
import {handleGetExtendedNews} from "@/Features/News/newsSlice.ts";

interface INews {
    title: string;
    content: string;
    slug: string;
    url_type: string;
    image: string;
    showWindow: number | string,
    id: number | string,
    func: (id: number | string) => void,
    urls: string
}

const NewItem: FC<INews> = (props) => {
    const { title ,url_type, slug, urls, image, content, id, showWindow} = props;
    const dispatch = useDispatch<AppDispatch>()
    if(showWindow === id){
        return <NewsWindow func={props.func} id={id} />
    }

    const handleOpenClick = () => {
        if(url_type !== "internal"){
            postEvent("web_app_open_link", {
                url: urls,
            })
        }else{
            dispatch(handleGetExtendedNews(slug))
            props.func(id)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.image}><img src={image} alt={"news"}/></div>
            <div className={styles.info_block}>
                <h2 className={styles.info_title}>{title}</h2>
                <p>{content}</p>
                <h3 onClick={handleOpenClick}>More <span>&#8599;</span></h3>
            </div>
        </div>
    )
}

export default NewItem;