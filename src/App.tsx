import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import History from './Pages/History';

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
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={ <Home/> }></Route>
        <Route path="/home" element={ <Home/> }></Route>
        <Route path="/history" element={ <History/> }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

