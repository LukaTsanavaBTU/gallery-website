import React, { RefObject, useEffect, useRef, useState } from 'react'
import './App.css'
// import response from "./tempResponse.js"

interface pictureResponse {
  id: string,
  alt_description: string,
  urls: {
    regular: string,
    [propName: string]: unknown
  }
  [propName: string]: unknown
}

interface cache {
  [propName: string]: pictureResponse[]
}

function App() {
  const [cache, setCache] = useState<cache>({});
  const [loadedCache, setLoadedCache] = useState(false);
  const [mainPage, setMainPage] = useState<pictureResponse[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // const [pagesLeft, setPagesLeft] = useState(true);
  const lastElemRef = useRef() as RefObject<HTMLDivElement>;
  const observer = new IntersectionObserver(intersectionCallback, { rootMargin: "200px" });
  const apiKey: string = import.meta.env.VITE_APP_KEY;

  useEffect(() => {
    // setCache(localStorage.get("cache", JSON.stringify(cache)));
    // setMainPage(response);
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

  function queryInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuery(e.target.value);
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
    console.log(call);
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

  // function handleScroll(e: React.UIEvent<HTMLElement>) {
  //   const scrollTop = e.target.
  // }

  return (
    <>
      <input type="text" value={query} onChange={queryInputHandler}/>
      <button onClick={addMoreHandler}>Add more</button>

      <div style={{width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr"}}>
        {mainPage.map((pic: pictureResponse, index: number) => {
          if (index === mainPage.length - 1) {
            return (
              <div ref={lastElemRef}  key={pic.id}>
                <img src={pic.urls.regular} alt={pic.alt_description} style={{width: "200px"}}/>
              </div>
            );
          }
          return (
            <div key={pic.id}>
              <img src={pic.urls.regular} alt={pic.alt_description} style={{width: "200px"}}/>
            </div>
          );
        })}
      </div>
    </>
  )
}

export default App

