import React, { useState } from 'react';
import './App.css';
import ImageContainer from './components/ImageContainer';

export interface pictureResponse {
  id: string,
  alt_description: string,
  urls: {
    regular: string,
    [propName: string]: unknown
  }
  [propName: string]: unknown
}

export interface cache {
  [propName: string]: pictureResponse[]
}

function App() {
  const [query, setQuery] = useState("");

  function queryInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuery(e.target.value);
  }

  return (
    <>
      <input type="text" value={query} onChange={queryInputHandler}/>

      <ImageContainer query={query}/>
    </>
  )
}

export default App

