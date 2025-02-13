import {FC} from "react";

import styles from './NavigationButtons.module.css';
import {NavLink} from "react-router-dom";
import NavigateButton from "./NavigateButton/NavigateButton.tsx";
import AiMic from "./ButtonIcons/AiMic.tsx";
import HomeIcon from "./ButtonIcons/HomeIcon.tsx";
import BookIcon from "./ButtonIcons/BookIcon.tsx";

const NavigationButtons : FC = () => {
    return (
        <div className={styles.container}>
            <NavLink className={styles.navlink} to={'home'}>
                {({isActive}) => (
                    <NavigateButton isActive={isActive}>
                        <HomeIcon isActive={isActive} />
                    </NavigateButton>
                )}
            </NavLink>
            <NavLink className={styles.navlink} to={'speaking'}>
                {({isActive}) => (
                    <NavigateButton isActive={isActive}>
                        <AiMic isActive={isActive} />
                    </NavigateButton>
                )}
            </NavLink>
            <NavLink className={styles.navlink} to={'lessons'}>
                {({isActive}) => (
                    <NavigateButton isActive={isActive}>
                        <BookIcon isActive={isActive} />
                    </NavigateButton>
                )}
            </NavLink>
        </div>
    )
}

export default NavigationButtons;