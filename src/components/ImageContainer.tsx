import { useState, useEffect, useRef, RefObject } from "react";
import { pictureResponse } from "../App";
import ImageItem from "./ImageItem";
import spinnerSvg from "../assets/spinner.svg";
import "./ImageContainer.css";
import Modal from "./Modal";

export interface infoResponse  {
    views: number,
    likes: number,
    downloads: number
}

export default function ImageContainer({query} : {query: string}) {
    const [mainPage, setMainPage] = useState<pictureResponse[]>([]);
    const [page, setPage] = useState(1);
    const [imagesLeft, setImagesLeft] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalmodalContent] = useState<{pic : pictureResponse, info : infoResponse} | undefined>();
    const lastElemRef = useRef() as RefObject<HTMLDivElement>;
    const observer = new IntersectionObserver(intersectionCallback, { rootMargin: "200px" });
    const apiKey: string = import.meta.env.VITE_APP_KEY;


    // Infinite Scroll

    useEffect(() => {
        if (lastElemRef.current != null) {
            observer.observe(lastElemRef.current);
        }
    }, [mainPage]);

    function intersectionCallback(entries: IntersectionObserverEntry[]) {
        const entry = entries[0];
        if (entry.isIntersecting) {
            setPage(page + 1);
            observer.unobserve(entry.target);
        }
    }


    // SearchBar Logic

    useEffect(() => {
        const inputTimer = setTimeout(() => {
            setPage(1);
        setImagesLeft(true);
        }, 1000);
        return () => {
            clearTimeout(inputTimer);
        }
    }, [query]);

    
    // Fetching

    useEffect(() => {
        displayImages();
    }, [page]);

    function fetchImages() : Promise<pictureResponse[]> {
        return new Promise((resolve) =>{
            const perPage = 20;
            const cleanedQuery = query.trim().toLocaleLowerCase();
            const isMain = cleanedQuery === "";
            const call = isMain ? `https://api.unsplash.com/photos?client_id=${apiKey}&page=${page}&per_page=${perPage}`
                                : `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${cleanedQuery}&page=${page}&per_page=${perPage}`
            if (imagesLeft) {    
                fetch(call)
                .then((response) => response.json())
                .then(json => {
                    const results = isMain ? json.slice(0, -2) : json.results; // We have to remove last 2 elements because unsplash returns duplicate images from main pages
                    if (results.length < (perPage / 2)) {
                        setImagesLeft(false);
                        console.log("no more images to fetch");
                    }
                    console.log("retrieved");
                    resolve(results);
                });
            } else {
                console.log("Not fetching");
            }
        })  
    }

    function displayImages() {
        fetchImages().then((results) => {
            if (results) {
                if (page > 1) {
                    setMainPage([
                    ...mainPage,
                    ...results
                    ]);
                }
                else {
                    setMainPage(results);
                }
            }
        });
    }

    // function fetchData(page: number) {
    //     let key: string;
    //     let call: string;
    //     const perPage = 20;
    //     const cleanedQuery = query.trim().toLocaleLowerCase();
    //     const isMain = cleanedQuery === "";
    //     if (isMain) {
    //         key = `MAIN-${page}`;
    //         call = `https://api.unsplash.com/photos?client_id=${apiKey}&page=${page}&per_page=${perPage}`;
    //     } else {
    //         key = `${cleanedQuery}-${page}`;
    //         call = `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${cleanedQuery}&page=${page}&per_page=${perPage}`;
    //     }
    //     if (imagesLeft) {
    //         if (key in cache) {
    //             if (page > 1) {
    //             setMainPage([
    //                 ...mainPage,
    //                 ...cache[key]
    //             ]);
    //             } else {
    //             setMainPage(cache[key]);
    //             }
    //             if (cache[key].length < (perPage / 2))  {
    //                 setImagesLeft(false);
    //                 console.log("no more images to fetch");
    //             }
    //             console.log("retrieved from cache");
    //         } else {
    //             fetch(call)
    //             .then((response) => response.json())
    //             .then(json => {
    //             const results = isMain ? json.slice(0, -2) : json.results; // We have to remove last 2 elements because unsplash returns duplicate images from main pages
    //             if (page > 1) {
    //                 setMainPage([
    //                 ...mainPage,
    //                 ...results
    //                 ]);
    //             }
    //             else {
    //                 setMainPage(results);
    //             }
    //             const newCache = {
    //                 ...cache,
    //                 [key]: results
    //             } 
    //             setCache(newCache);
    //             window.localStorage.setItem("cache", JSON.stringify(newCache));
    //             if (results.length < (perPage / 2)) {
    //                 setImagesLeft(false);
    //                 console.log("no more images to fetch");
    //             }
    //             console.log("retrieved new");
    //             });
    //         }  
    //     } else {
    //         console.log("Not fetching");
    //     }
    // }

    // Modals

    function openModalHandler(pic: pictureResponse) {
        fetch(`https://api.unsplash.com//photos/${pic.id}/statistics?client_id=${apiKey}`)
        .then(response => response.json())
        .then(json => {
            const info : infoResponse = {
                views: json.views.total,
                likes: json.likes.total,
                downloads: json.downloads.total
            };
            setModalmodalContent({pic, info});
            setModalOpen(true);
        })
    }

    function closeModalHandler() {
        setModalOpen(false);
    }

    return (
    <>
        {(modalOpen && modalContent) && <Modal closeModalHandler={closeModalHandler} modalImg={modalContent.pic} modalInfo={modalContent.info}/>}
        <div className="image-container">
            {mainPage.length > 0 
            ? mainPage.map((pic: pictureResponse, index: number) => {
                if (index === mainPage.length - 1) {
                return (
                    <ImageItem pic={pic} clickHandler={() => openModalHandler(pic)} refProp={lastElemRef} key={pic.id} />
                );
                }
                return (
                    <ImageItem  pic={pic} clickHandler={() => openModalHandler(pic)} key={pic.id} />
                );
            }) 
            : <div className="spin-container">
                <img className="spinner" src={spinnerSvg} alt="Loading"/>
            </div>}
        </div>
    </>
    )
}
