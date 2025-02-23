import UserGreating from "../../components/User-Greating/UserGreating.tsx";
import NewsBlock from "../../components/News/NewsBlock/NewsBlock.tsx";
import CalendarDisplay from "@/components/Calendar/CalendarDisplay.tsx";


const Home = () => {
    return (
        <div className="home">
            <UserGreating/>
            <NewsBlock/>
            <CalendarDisplay/>
        </div>
    )
}
export default Home;