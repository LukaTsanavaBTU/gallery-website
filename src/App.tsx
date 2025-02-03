import React, { useEffect, useState } from 'react'
import './App.css'
import response from "./tempResponse.js"

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
  const [mainPage, setMainPage] = useState<pictureResponse[]>([]);
  const [query, setQuery] = useState("");
  const apiKey: string = import.meta.env.VITE_APP_KEY;
  useEffect(() => {
    // setCache(localStorage.get("cache", JSON.stringify(cache)));
    // fetch(`https://api.unsplash.com/photos?client_id=${apiKey}`)
    //   .then((response) => response.json())
    //   .then(json => setMainPage(json));
    setMainPage(response);
  }, []);

  useEffect(() => {
    const inputTimer = setTimeout(() => {
      if (query !== "") {
        searchQuery(query);
      }
    }, 1000);
    return () => {
      clearTimeout(inputTimer);
    }
}, [query]);

  function queryInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuery(e.target.value);
  }

  function searchQuery(query: string, page = 1) {
    const key = `${query}-${page}`;
    if (key in cache) {
      setMainPage(cache[key]);
      console.log("retrieved from cache");
    } else {
      fetch(`https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${query}&page=${page}`)
      .then((response) => response.json())
      .then(json => {
        setMainPage(json.results);
        const newCache = {
          ...cache,
          [key]: json.results
        } 
        setCache(newCache);
        console.log("retrieved new");
    });
    }  
  }

  // function handleScroll(e: React.UIEvent<HTMLElement>) {
  //   const scrollTop = e.target.
  // }

  return (
    <>
      <input type="text" onChange={queryInputHandler}/>

      {mainPage.map((pic: pictureResponse) => {
        return (
          <div key={pic.id}>
            <img src={pic.urls.regular} alt={pic.alt_description} style={{width: "200px"}}/>
          </div>
        );
      })}
    </>
  )
}

export default App

