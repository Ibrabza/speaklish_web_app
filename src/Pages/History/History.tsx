import styles from "./History.module.css"
import HistoryItem from "@/components/HistoryItem/HistoryItem.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";
import { formatDateString } from "@/Helpers/helper.ts";
import {useEffect, useState} from "react";
import { handleGetHistory } from "@/Features/User/userSlice.ts";
import ResultScreen from "@/components/ResultScreen/ResultScreen.tsx";

const History = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, history } = useSelector( (state : RootState) => state.user);
    const [ showResult, setShowResult ] = useState<number | string>("");

    useEffect(()=>{
        dispatch(handleGetHistory())
    },[dispatch])

    if(loading && !history) return <Loading/>

    return (
        <div className={styles.container}>
            <h3>History of Speakings</h3>
            {showResult && <ResultScreen id={showResult} func={setShowResult} />}
            <div className={styles.history_list}>
                <ul>
                    {history && history.results && history.results.map((item) => <HistoryItem
                        date={formatDateString(item.created_at) || "failed"}
                        score={Number(item.band_score)}
                        id={item.id}
                        func={setShowResult}
                        key={item.id}/>
                    )}
                </ul>
            </div>
        </div>
    )
}


export default History;