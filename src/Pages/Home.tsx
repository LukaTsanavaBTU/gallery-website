import ImageContainer from '../components/ImageContainer';
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

export default function Home() {
  const [searchVal, setSearchVal] = useState("");
  const [query, setQuery] = useState("");

  function searchInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setSearchVal(e.target.value);
  }

  useEffect(() => {
      const inputTimer = setTimeout(() => {
          setQuery(searchVal);
      }, 1000);
      return () => {
          clearTimeout(inputTimer);
      }
  }, [searchVal]);

  return (
    <>
      <header>
        <Navigation selected="home" />
      </header>
      <main>
        <input type="text" value={searchVal} onChange={searchInputHandler} placeholder='Search...'/>
        <ImageContainer query={query}/>
      </main>
    </>
  )
}