import {Link} from "react-router-dom"
import AnkiIcon from "./AnkiIcon"
import "../css/Header.css"

export default function Header(){
    return (
    <header > 
        <AnkiIcon size={50}  />
        <nav>
            <Link to="/">Home</Link>
            <Link to="/decks">Decks</Link>
            <Link to="/addCards">Adding Card</Link>

        </nav>
    </header>
)}