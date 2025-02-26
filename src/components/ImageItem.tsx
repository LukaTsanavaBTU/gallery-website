import React from "react";
import { pictureResponse } from "../App";

export default function ImageItem({pic, clickHandler, refProp} : {pic: pictureResponse, clickHandler: () => void, refProp?: React.RefObject<HTMLDivElement>}) {
    return (
        <div onClick={clickHandler} ref={refProp}>
            <img src={pic.urls.regular} alt={pic.alt_description}/>
        </div>
    );
}