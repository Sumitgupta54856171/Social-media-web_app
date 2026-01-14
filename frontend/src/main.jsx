import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Routes } from 'react-router-dom';
import './wdyr.js'
import SocketProvider from './context/socketcontext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
   
    <SocketProvider><App /></SocketProvider>
    
    </BrowserRouter>
  </StrictMode>,
)
