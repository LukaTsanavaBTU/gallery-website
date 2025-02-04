import React from "react";
import { pictureResponse } from "../App";

export default function ImageItem({pic, refProp} : {pic: pictureResponse, refProp?: React.RefObject<HTMLDivElement>}) {
    return (
        <div ref={refProp}>
            <img src={pic.urls.regular} alt={pic.alt_description} style={{width: "200px"}}/>
        </div>
    );
}