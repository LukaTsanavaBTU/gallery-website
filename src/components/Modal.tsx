import { pictureResponse } from "../App";
import { infoResponse } from "./ImageContainer";
import "./Modal.css";
import spinnerSvg from "../assets/spinner.svg";

export default function Modal({closeModalHandler, modalImg, modalInfo} : {closeModalHandler: () => void, modalImg?: pictureResponse, modalInfo?: infoResponse}) {
    return (
        <>
            <div className="backdrop"></div>
            <div className="modal">
                <div className="close" onClick={closeModalHandler}>X</div>
                <div className="full-image">
                    {modalImg ? 
                        <img src={modalImg.urls.regular} alt={modalImg.alt_description}/>
                        : 
                        <div className="spin-container">
                            <img className="spinner" src={spinnerSvg} alt="Loading"/>
                        </div> 
                    }
                </div>
                {modalInfo && 
                    <>
                        <div className="downloads">Downloads: <span>{modalInfo.downloads}</span></div>
                        <div className="likes">Likes: <span>{modalInfo.likes}</span></div>
                        <div className="views">Views: <span>{modalInfo.views}</span></div>
                    </>
                }     
            </div>
        </>
    );
}