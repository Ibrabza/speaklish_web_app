import {FC} from "react";
import ReactPlayer from 'react-player'

interface IVPlayer{
    link:string,
}


const VideoPlayer: FC<IVPlayer> = (props) => {
    return (
        <ReactPlayer
            url={props.link}
            controls
            config={{ file: { attributes: { controlsList: "nodownload" } } }}
            style={{ border: "0 solid black", borderRadius: "24px" }}
            width="100%"
            height="auto"
        />
    )
}


export default VideoPlayer;