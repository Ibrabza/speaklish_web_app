import {FC, useEffect} from "react";
// import styles from "./Auth.module.css"
// import Loading from "@/components/ui/Loading.tsx";
import {useNavigate} from "react-router-dom";
import {GrStatusGood} from "react-icons/gr";
import Button1 from "@/components/ui/Button1.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/Store/store.ts";
import {handleAuth} from "@/Features/User/userSlice.ts";


const Auth :FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const {isAuthorized, refresh, loading, access,} = useSelector((state: RootState) => state.user);
    console.log(isAuthorized)

    useEffect(()=>{
        if(!access && !refresh){
            dispatch(handleAuth({initData: window.location.hash, password: "123456", username: "ibrabza", phoneNumber: "123456789"}))
        }
    },[access, dispatch, refresh])

    const navigate = useNavigate();

    function handleClick(){
        navigate('/test');
    }

    const textToButton = !isAuthorized ? "Not authorized yet" : "Continue"

    return (
        <div className={" h-dvh text-green-800"}>
            <div className={" h-dvh bg-gray-50 w-dvw flex flex-col items-center gap-4 justify-center "}>
                <div className=" flex flex-col items-center gap-5">
                    {(!isAuthorized || loading) ? <>
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"/>
                            <span className={"text-sm font-medium text-gray-700"}>
                                Authorizing checking...
                            </span>
                        </>
                        :
                        <>
                            <GrStatusGood color={'green'} size={40}/>
                            <span>
                                Authorized
                            </span>

                        </>
                    }
                    {/*<label className={"text-2xl font-medium"} htmlFor='phoneNumber'>Enter phone number</label>*/}
                    {/*<input className={"text-center py-3 px-3 block border-1 overflow-hidden border-solid border-black rounded-3xl"} placeholder={"(00)-000-00-00"} value={tel} onChange={(e) => setTel(e.target.value)} name="phoneNumber" type="tel"  />*/}
                </div>
                {isAuthorized &&
                    <Button1
                        className={"px-4 py-2 flex items-center bg-primary text-black rounded-lg disabled:bg-gray-400"}
                        disabled={!isAuthorized}
                        onClick={handleClick}
                        text={textToButton}
                    />
                }
            </div>
        </div>
    )
}

export default Auth;