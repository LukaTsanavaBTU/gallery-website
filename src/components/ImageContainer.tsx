import { useState, useEffect, useRef, RefObject } from "react";
import { pictureResponse, cache } from "../App";
import ImageItem from "./ImageItem";
import spinnerSvg from "../assets/spinner.svg";
import "./ImageContainer.css";
import Modal from "./Modal";

export default function ImageContainer({query} : {query: string}) {
    const [cache, setCache] = useState<cache>({});
    const [loadedCache, setLoadedCache] = useState(false);
    const [mainPage, setMainPage] = useState<pictureResponse[]>([]);
    const [page, setPage] = useState(1);
    const [imagesLeft, setImagesLeft] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    // const [modalImg, setModalImg] = useState<pictureResponse | undefined>();
    const lastElemRef = useRef() as RefObject<HTMLDivElement>;
    const observer = new IntersectionObserver(intersectionCallback, { rootMargin: "200px" });
    const apiKey: string = import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        const localCache = window.localStorage.getItem("cache");
        if (localCache != null) {
            setCache(JSON.parse(localCache));
        }
        setLoadedCache(true);
    }, []);

    useEffect(() => {
        if (!loadedCache) return;
        const inputTimer = setTimeout(() => {
            searchQuery();
        }, 1000);
        return () => {
            clearTimeout(inputTimer);
        }
    }, [query, loadedCache]);

    useEffect(() => {
        if (lastElemRef.current != null) {
            observer.observe(lastElemRef.current);
        }
    }, [mainPage]);

    function intersectionCallback(entries: IntersectionObserverEntry[]) {
        const entry = entries[0];
        if (entry.isIntersecting) {
            addMoreHandler();
            observer.unobserve(entry.target);
        }
    }

    function searchQuery() {
        setPage(1);
        setImagesLeft(true);
        fetchData(1);
    }

    function addMoreHandler() {
        const newPage = page + 1;
        setPage(newPage);
        fetchData(newPage);
    }

    function fetchData(page: number) {
        let key: string;
        let call: string;
        const perPage = 20;
        const cleanedQuery = query.trim().toLocaleLowerCase();
        const isMain = cleanedQuery === "";
        if (isMain) {
            key = `MAIN-${page}`;
            call = `https://api.unsplash.com/photos?client_id=${apiKey}&page=${page}&per_page=${perPage}`;
        } else {
            key = `${cleanedQuery}-${page}`;
            call = `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${cleanedQuery}&page=${page}&per_page=${perPage}`;
        }
        if (imagesLeft) {
            if (key in cache) {
                if (page > 1) {
                setMainPage([
                    ...mainPage,
                    ...cache[key]
                ]);
                } else {
                setMainPage(cache[key]);
                }
                if (cache[key].length < (perPage / 2))  {
                    setImagesLeft(false);
                    console.log("no more images to fetch");
                }
                console.log("retrieved from cache");
            } else {
                fetch(call)
                .then((response) => response.json())
                .then(json => {
                const results = isMain ? json.slice(0, -2) : json.results; // We have to remove last 2 elements because unsplash returns duplicate images from main pages
                if (page > 1) {
                    setMainPage([
                    ...mainPage,
                    ...results
                    ]);
                }
                else {
                    setMainPage(results);
                }
                const newCache = {
                    ...cache,
                    [key]: results
                } 
                setCache(newCache);
                window.localStorage.setItem("cache", JSON.stringify(newCache));
                if (results.length < (perPage / 2)) {
                    setImagesLeft(false);
                    console.log("no more images to fetch");
                }
                console.log("retrieved new");
                });
            }  
        } else {
            console.log("Not fetching");
        }
    }

    function openModalHandler() {
        setModalOpen(true);
    }

    function closeModalHandler() {
        setModalOpen(false);
    }

    return (
    <>
        {modalOpen && <Modal closeModalHandler={closeModalHandler}/>}
        <div className="image-container">
            {mainPage.length > 0 
            ? mainPage.map((pic: pictureResponse, index: number) => {
                if (index === mainPage.length - 1) {
                return (
                    <ImageItem pic={pic} clickHandler={openModalHandler} refProp={lastElemRef} key={pic.id} />
                );
                }
                return (
                    <ImageItem  pic={pic} clickHandler={openModalHandler} key={pic.id} />
                );
            }) 
            : <div className="spin-container">
                <img className="spinner" src={spinnerSvg} alt="Loading"/>
            </div>}
        </div>
    </>
    )
}
