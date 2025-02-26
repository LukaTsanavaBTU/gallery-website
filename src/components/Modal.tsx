import "./Modal.css";

export default function Modal({closeModalHandler} : {closeModalHandler: () => void}) {
    return (
        <>
            <div className="backdrop"></div>
            <div className="modal">
                <div className="close" onClick={closeModalHandler}>X</div>
                <div className="full-image">
                    <img src="" alt="" />
                </div>
                <div className="downloads">Downloads: <span>1000</span></div>
                <div className="likes">Likes: <span>1000</span></div>
                <div className="views">Views: <span>1000</span></div>
            </div>
        </>
    );
}