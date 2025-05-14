import {FC} from "react";

import styles from "./NewsWindow.module.css"
import {useClickOutside} from "@/hooks/useClickOutside.ts";
import {RootState} from "@/Store/store.ts";
import {useSelector} from "react-redux";
import ErrorPage from "@/Pages/Error/ErrorPage.tsx";
import Loading from "@/components/Loading.tsx";

interface INewsWindow {
    id: number | string;
    // title: string;
    // description: string;
    // link?: string;
    // image?: string;
    func: (id: number | string) => void,
}

const NewsWindow : FC<INewsWindow> = (props) => {
    const windowRef = useClickOutside<HTMLDivElement>(() => props.func(""))
    const extendedNews = useSelector((state: RootState) => state.news.extendedNews)
    const loading = useSelector((state: RootState) => state.news.loading)
    console.log(extendedNews)

    if (!extendedNews) return <ErrorPage message={"Failed to get content of this news"}/>;

    if (loading) return <div className={styles.mainContainer}>
        <div className={styles.container} ref={windowRef}>
            <Loading />
        </div>
    </div>

    const {image, content, title} = extendedNews
    const img = image.startsWith('http:') ? image.replace('http:', 'https:') : image

    return <div className={styles.mainContainer}>
        <div className={styles.container} ref={windowRef}>
            <div className={styles.image}><img src={img} alt={"news"}/></div>
            <div className={styles.info_block}>
                <h2 className={styles.info_title}>{title}</h2>
                <p>{content}</p>
                <button onClick={() => props.func("")}>Close</button>
            </div>
        </div>
    </div>
}

export default NewsWindow;