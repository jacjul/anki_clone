import {Link} from "react-router-dom"
import AnkiIcon from "./AnkiIcon"
import "../css/Header.css"

export default function Header(){
    return (
        <header className="bg-zinc-900 text-white border-b border-zinc-800">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AnkiIcon size={36} />
                    <span className="hidden sm:inline text-sm text-zinc-300">Anki Clone</span>
                </div>
                <nav className="flex items-center gap-4 sm:gap-6 text-sm">
                    <Link className="text-zinc-200 hover:text-white transition" to="/">Home</Link>
                    <Link className="text-zinc-200 hover:text-white transition" to="/decks">Decks</Link>
                    <Link className="text-zinc-200 hover:text-white transition" to="/addCards">Add Cards</Link>
                    <Link className="text-zinc-200 hover:text-white transition" to="/learn">Practice</Link>
                </nav>
            </div>
        </header>
    )
}