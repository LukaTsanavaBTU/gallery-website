import ImageContainer from '../components/ImageContainer';
import React, { useState } from 'react';
import Navigation from '../components/Navigation';

export default function Home() {
  const [query, setQuery] = useState("");

  function queryInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuery(e.target.value);
  }

  return (
    <>
      <Navigation/>
      <input type="text" value={query} onChange={queryInputHandler}/>
      <ImageContainer query={query}/>
    </>
  )
}