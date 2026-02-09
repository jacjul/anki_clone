import { lazy, Suspense } from 'react'
import {Routes, Route} from "react-router-dom"
import './App.css'
import Header from "./components/Header"

const Home = lazy(()=>import("./sites/Home"));
const DecksSite =lazy(()=>import("./sites/DecksSite"))
const AddCardSite =lazy(()=> import("./sites/AddCardSite"))
const LearnSite =lazy(()=> import('./sites/LearnSite.tsx'))

function App() {
  
  return (
    
    <>
      <Header />
      <Suspense fallback={<div>Loading</div>}>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/decks" element={<DecksSite />}/>
        <Route path="/addCards" element={<AddCardSite />} />
        <Route path="/addCards/:deckId" element={<AddCardSite />} />
        <Route path="/learn" element={<LearnSite />} />
      </Routes>
      </Suspense >
    </>
  )
}

export default App
