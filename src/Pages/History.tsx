import ImageContainer from '../components/ImageContainer';
import React, { useState } from 'react';
import Navigation from '../components/Navigation';

export default function History() {
    const [query, setQuery] = useState("");
    const savedCache = window.localStorage.getItem("cache");
    const options: string[] = savedCache ? extractOptions(savedCache) : [];

    function queryChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        setQuery(e.target.value);
    }

    function extractOptions(rawJson: string) {
        let extracted = Object.keys(JSON.parse(rawJson));
        extracted = extracted.map(option => {
            return option.split("-").slice(0, -1).join("");
        });
        extracted = [...new Set(extracted)];
        extracted = extracted.filter(option => option !== "MAIN");
        return extracted;
    }
    return (
    <>
        <Navigation/>
        <select onChange={queryChangeHandler}>
            <option value="MAIN">Main Page</option>
            {options.map(option => {
                return (
                    <option key={option} value={option}>{option}</option>
                );
            })}
        </select>

        <ImageContainer query={query}/>
    </>
    )
}