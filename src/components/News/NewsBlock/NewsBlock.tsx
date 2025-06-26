import {FC, useEffect, useRef, useState} from "react";

import styles from "./NewsBlock.module.css"
import NewItem from "../NewItem/NewItem.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import SmallLoading from "@/components/SmallLoading/SmallLoading.tsx";

const NewsBlock: FC = () => {
    const [showNews, setShowNews] = useState<string | number>("")
    const results = useSelector( (state: RootState) => state.news.results)
    const scrollNews = useRef<HTMLDivElement>(null)

    // const handleShowNews = (val : number | string) => {
    //     setShowNews(val);
    // }

    useEffect(() => {
        const element = scrollNews.current;
        if(element){
            element.scrollTo(
                {
                    left: 15,
                    behavior: "smooth",
                }
            )
        }
    }, []);

    if(!results) return <SmallLoading/>
    return (
        <div className={styles.container} ref={scrollNews}>
            <div className={styles.scrolling} >
                {results.map((item, i) => (
                    <NewItem
                        urls={item.urls}
                        showWindow={showNews}
                        func={setShowNews}
                        id={i}
                        key={i}
                        title={item.title}
                        content={item.content}
                        url_type={item.url_type}
                        slug={item.slug}
                        image={item.image ? (item.image.startsWith('http:') ? item.image.replace('http:', 'https:') : item.image) : ""}
                    />
                ))}
            </div>
        </div>
    )
}

export default NewsBlock;