import {FC} from "react";
import ReactPlayer from 'react-player'

interface IVPlayer{
    link:string,
}


const VideoPlayer: FC<IVPlayer> = (props) => {
    return (
        <ReactPlayer light={true} style={{border: "0 solid black",borderRadius: "24px"}} url={props.link} width={"100%"} height={"190px"}/>
    )
}


export default VideoPlayer;