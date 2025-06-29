import {FC} from "react";

interface IDIcon {
    color: string;
}

const DownloadIcon: FC<IDIcon> = (props) => {
    return <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.5 12.6078L2.69487 13.16C3.45333 15.3089 3.83257 16.3834 4.69785 16.9957C5.56313 17.6078 6.70258 17.6078 8.9815 17.6078H11.0185C13.2974 17.6078 14.4368 17.6078 15.3022 16.9957C16.1674 16.3834 16.5467 15.3089 17.3052 13.16L17.5 12.6078"
            stroke={props.color} strokeWidth="1.5" strokeLinecap="round"/>
        <path
            d="M9.99996 12.6078V4.27448M9.99996 12.6078C9.41646 12.6078 8.32623 10.9459 7.91663 10.5245M9.99996 12.6078C10.5835 12.6078 11.6737 10.9459 12.0833 10.5245"
            stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

}

export default DownloadIcon;