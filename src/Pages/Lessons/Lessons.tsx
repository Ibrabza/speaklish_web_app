import {FC, useEffect} from "react";
import LessonsList from "@/components/LessonsList/LessonsList.tsx";
import {useDispatch, useSelector} from "react-redux";
import {handleGetLessons} from "@/Features/User/userSlice.ts";
import {AppDispatch, RootState} from "@/Store/store.ts";
import Loading from "@/components/Loading.tsx";


const Lessons: FC = () => {
    const access_token = useSelector((state:RootState) => state.user.access)
    const question_list = useSelector((state:RootState) => state.user.question_list)
    const dispatch = useDispatch<AppDispatch>()

    // console.log(access_token)

    useEffect( () => {
        if (access_token) {
            dispatch(handleGetLessons());
        }
    }, [access_token,dispatch] )

    if(!question_list) return <Loading/>

    return (
        <div className={"lessons"}>
            <LessonsList/>
        </div>
    )
}


export default Lessons;