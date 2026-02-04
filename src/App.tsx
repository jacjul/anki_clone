import { useState, useEffect } from 'react'
import { getAPI, postAPI }  from "./api.ts"
import {Routes, Route} from "react-router-dom"
import './App.css'
import Header from "./components/Header"
import Home from "./sites/Home"
import DecksSite from "./sites/DecksSite"
import AddCardSite from "./sites/AddCardSite"
import LearnSite from './sites/LearnSite.tsx'

function App() {
  const [message, setMessage] = useState("")


  
  return (
    
    <>
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/decks" element={<DecksSite />}/>
        <Route path="/addCards" element={<AddCardSite />} />
        <Route path="/addCards/:deckId" element={<AddCardSite />} />
        <Route path="/learn" element={<LearnSite />} />
      </Routes>
    </>
  )
}

export default App
