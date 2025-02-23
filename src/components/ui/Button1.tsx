import {FC} from "react";

interface IButton1 {
    onClick(): void;
    text: string;
    className: string;
    disabled: boolean;
}

const  Button1 :FC<IButton1> = ({ onClick, disabled, text, className}) =>{
    return (
        <button
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {text}
        </button>
    )
}

export default Button1;