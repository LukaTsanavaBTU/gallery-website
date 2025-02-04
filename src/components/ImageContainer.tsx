import { useState, useEffect, useRef, RefObject } from "react";
import { pictureResponse, cache } from "../App";
import ImageItem from "./ImageItem";

export default function ImageContainer({query} : {query: string}) {
    const [cache, setCache] = useState<cache>({});
    const [loadedCache, setLoadedCache] = useState(false);
    const [mainPage, setMainPage] = useState<pictureResponse[]>([]);
    const [page, setPage] = useState(1);
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
    const cleanedQuery = query.trim().toLocaleLowerCase();
    const isMain = cleanedQuery === "";
    if (isMain) {
        key = `MAIN-${page}`;
        call = `https://api.unsplash.com/photos?client_id=${apiKey}&page=${page}&per_page=20`;
    } else {
        key = `${cleanedQuery}-${page}`;
        call = `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${cleanedQuery}&page=${page}&per_page=20`;
    }
    if (key in cache) {
        if (page > 1) {
        setMainPage([
            ...mainPage,
            ...cache[key]
        ]);
        } else {
        setMainPage(cache[key]);
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
        console.log("retrieved new");
        });
    }  
    }

    return (
    <>
        <div style={{width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            {mainPage.map((pic: pictureResponse, index: number) => {
                if (index === mainPage.length - 1) {
                return (
                    <ImageItem pic={pic} refProp={lastElemRef}  key={pic.id} />
                );
                }
                return (
                    <ImageItem pic={pic} key={pic.id} />
                );
            })}
        </div>
    </>
    )
}
