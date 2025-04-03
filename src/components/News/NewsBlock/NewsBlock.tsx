import {FC} from "react";

import styles from "./NewsBlock.module.css"
import NewItem from "../NewItem/NewItem.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";

const NewsBlock: FC = () => {
    const results = useSelector( (state: RootState) => state.news.results)
    if(!results) return <Loading/>
    return (
        <div className={styles.container}>
            <div className={styles.scrolling}>
                {results.map((item, i) => (
                    <NewItem
                        key={i}
                        title={item.title}
                        content={item.content}
                        image={item.image.startsWith('http:') ? item.image.replace('http:', 'https:') : item.image}
                    />
                ))}
            </div>
        </div>
    )
}

export default NewsBlock;