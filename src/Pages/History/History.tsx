import styles from "./History.module.css"
import HistoryItem from "@/components/HistoryItem/HistoryItem.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";
import {formatDateString} from "@/Helpers/helper.ts";
import {useEffect} from "react";
import {handleGetHistory} from "@/Features/User/userSlice.ts";

const History = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, history } = useSelector( (state : RootState) => state.user);

    useEffect(()=>{
        dispatch(handleGetHistory())
    },[dispatch])

    if(loading && !history) return <Loading/>

    return (
        <div className={styles.container}>
            <h3>History of Speakings</h3>
            <div className={styles.history_list}>
                <ul>
                    {history && history.results && history.results.map((item) => <HistoryItem
                        date={formatDateString(item.created_at) || "failed"}
                        score={Number(item.band_score)} />
                    )}
                </ul>
            </div>
        </div>
    )
}


export default History;