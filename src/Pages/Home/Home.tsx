import UserGreating from "../../components/User-Greating/UserGreating.tsx";
import NewsBlock from "../../components/News/NewsBlock/NewsBlock.tsx";
import CalendarDisplay from "@/components/Calendar/CalendarDisplay.tsx";
import {useEffect} from "react";
import {getDataCal} from "@/Features/Calendar/CalendarSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {handleGetNews} from "@/Features/News/newsSlice.ts";
import {getGroupData} from "@/Features/User/userSlice.ts";


const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const newsCount = useSelector((state : RootState) => state.news.count);

    const isAuthorized = localStorage.getItem("isAuthorized");

    useEffect(() => {
        if(isAuthorized) {
            dispatch(getGroupData());
        }
        dispatch(getDataCal());
        dispatch(handleGetNews())
    }, [dispatch]);

    return (
        <div className="home">
            <UserGreating/>
            {newsCount !== 0 && <NewsBlock/>}
            <CalendarDisplay/>
        </div>
    );
}
export default Home;