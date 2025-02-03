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

function App() {
  // const [cache, setCache] = useState([]);
  const [mainPage, setMainPage] = useState<pictureResponse[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // setCache(localStorage.get("cache", JSON.stringify(cache)));
    // fetch("https://api.unsplash.com/photos?client_id=MY_API")
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

  function searchQuery(query: string) {
    fetch(`https://api.unsplash.com/search/photos?client_id=hmYdWZI9yjeFowfgT5e4b3xscGXbxj7Hz-ZqAvjYpy0&query=${query}`)
    .then((response) => response.json())
    .then(json => setMainPage(json.results));
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

