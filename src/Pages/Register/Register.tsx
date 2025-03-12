import styles from "./Register.module.css";
import { FC, FormEvent, useState } from "react";
import toast, {Toaster} from "react-hot-toast";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/Store/store.ts";
import {handleReg} from "@/Features/User/userSlice.ts";

const Register: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const tg_id = window.Telegram.WebApp.initDataUnsafe.user.id
    const tg_id = 123456789;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ phoneNumber, password, tg_id });
        dispatch(handleReg({ password, phone: phoneNumber, telegram_id: tg_id }))
        toast.success("Registered successfully")
        window.open("https://t.me/mySpeaky_bot", "_self");
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src={"/speaklish.svg"} alt={"speaklish"}/>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.register_inputs}>
                        <div className={styles.input_field}>
                            <label htmlFor="phone">Phone number</label>
                            <input
                                name="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                placeholder="+998 90 123 45 67"
                                minLength={9}
                            />
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="********"
                                minLength={8}
                            />
                        </div>
                        <div className={styles.input_field}>
                            <label htmlFor="tg_id">Telegram ID</label>
                            <input type="tel" value={tg_id} readOnly/>
                        </div>
                    </div>
                    <button type="submit" className={styles.register_button}>
                        Register
                    </button>
                </form>
            </div>
            <Toaster position={"top-center"}/>
        </>
    );
};

export default Register;
