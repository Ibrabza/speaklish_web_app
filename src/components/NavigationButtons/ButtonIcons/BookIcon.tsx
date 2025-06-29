import {FC} from "react";

interface IBookIconProps {
    isActive: boolean;
}

const BookIcon: FC<IBookIconProps> = (props) => {

    const color = props.isActive ? "white" : "black";
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 4.94531H16C16.8284 4.94531 17.5 5.61688 17.5 6.44531V7.94531" stroke={color}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 12.9453H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16.9453H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M18.497 2L6.30767 2.00002C5.81071 2.00002 5.30241 2.07294 4.9007 2.36782C3.62698 3.30279 2.64539 5.38801 4.62764 7.2706C5.18421 7.7992 5.96217 7.99082 6.72692 7.99082H18.2835C19.077 7.99082 20.5 8.10439 20.5 10.5273V17.9812C20.5 20.2007 18.7103 22 16.5026 22H7.47246C5.26886 22 3.66619 20.4426 3.53959 18.0713L3.5061 5.16638"
                stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

    )
}

export default BookIcon;