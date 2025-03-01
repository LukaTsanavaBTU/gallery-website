import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./styles/reset.css";
import './App.css';
import Home from './Pages/Home';
import History from './Pages/History';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface pictureResponse {
  id: string,
  alt_description: string,
  urls: {
    regular: string,
    [propName: string]: unknown
  }
  [propName: string]: unknown
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index element={ <Home/> }></Route>
          <Route path="/home" element={ <Home/> }></Route>
          <Route path="/history" element={ <History/> }></Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App

