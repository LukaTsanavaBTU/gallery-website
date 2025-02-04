import React, { useEffect } from "react";
import { pictureResponse } from "../App";

export default function ImageItem({pic, refProp} : {pic: pictureResponse, refProp?: React.RefObject<HTMLDivElement>}) {
    const apiKey: string = import.meta.env.VITE_APP_KEY;

    // Was running out of time, so had to rush the modal logic

    useEffect(() => {
        const modal = document.querySelector("dialog");
        modal?.close();
        const onCloseHandler = () => {
            modal?.close();
        }
        const closeDiv = modal?.querySelector(".close");
        closeDiv?.addEventListener("click", onCloseHandler); 
        return () => {
            closeDiv?.removeEventListener("click", onCloseHandler)
        } 
    }, []);

    function clickHandler() {
        const modal = document.querySelector("dialog");        
        const imageContainer = modal?.querySelector("img");
        const downloadSpan = modal?.querySelector(".downloads span");
        const likesSpan = modal?.querySelector(".likes span");
        const viewsSpan = modal?.querySelector(".views span");
        fetch(`https://api.unsplash.com//photos/${pic.id}/statistics?client_id=${apiKey}`)
        .then(response => response.json())
        .then(json => {
            const views = json.views.total;
            const likes = json.likes.total;
            const downloads = json.downloads.total;
            imageContainer?.setAttribute("src", pic.urls.regular);
            downloadSpan!.textContent = downloads;
            likesSpan!.textContent = likes;
            viewsSpan!.textContent = views;
            modal?.showModal();
        })
    }
    return (
        <div ref={refProp} onClick={() => clickHandler()}>
            <img src={pic.urls.regular} alt={pic.alt_description}/>
        </div>
    );
}