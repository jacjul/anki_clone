
import {postAPI, getAPI} from "../api"
import {useEffect,useState} from "react"
import type {JSX} from "react"
import {useLocation, useParams} from "react-router-dom"
type DeckProps = {
    id:number
    name:string
    selected: boolean
}

export default function AddCardSite(){
    const [receivingDeck,setReceivingDeck]=useState<DeckProps[]>(()=>[])
    const [selectedDeckValue, setSelectedDeckValue] =useState<number>(()=>0)
        const location = useLocation();
        const { deckId } = useParams();


        // Initialize selected deck from URL param, navigation state, or localStorage
        useEffect(() => {
            let candidate = 0;
            if (deckId) {
                candidate = Number(deckId);
            } else if (location.state) {
                const s: any = location.state;
                candidate = typeof s === 'number' ? s : Number(s?.id || 0);
            } else {
                candidate = Number(localStorage.getItem("selectedDeckId") || 0);
            }
            if (candidate) {
                setSelectedDeckValue(candidate);
            }
        }, [deckId, location.state]);
        

        let htmlDecks: JSX.Element | null = null
        useEffect(() => {
            getAPI("/api/decks").then(data => {
                if (data) {
                    const decks: DeckProps[] = data.message.map((deck:DeckProps):DeckProps =>
                        Object.assign(deck, {"selected":false})
                    )
                    setReceivingDeck(decks)
                }
            });
        },[] )

        // Ensure selectedDeckValue is valid against the loaded decks
        useEffect(() => {
            if (receivingDeck.length) {
                setSelectedDeckValue(prev => {
                    if (prev && receivingDeck.some(d => d.id === prev)) return prev;
                    return receivingDeck[0].id;
                })
            }
        }, [receivingDeck])
    //create the html element to add
    function createDropdown(decks:DeckProps[]){
        return (
            <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-700">Select deck</label>
                <select
                    name="deck_id"
                    value={selectedDeckValue || ""}
                    onChange={getDeck}
                    className="mt-1 w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                    {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
                </select>
            </div>
        )
    }

     const getDeck = (event: React.ChangeEvent<HTMLSelectElement>) =>{
         const selectedId = Number(event.target.value)
         setSelectedDeckValue(selectedId)
         localStorage.setItem("selectedDeckId",event.target.value)
    
    


    
   }
    if(receivingDeck.length){
        htmlDecks =createDropdown(receivingDeck)
    }
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        console.log(formData)
        const front = (formData.get("front") as string) || ""
        const back = (formData.get("back") as string) || ""
        const description = (formData.get("description") as string) || ""
        
        const withSentence = (formData.get("withSentence") as string) || ""
        const withSentenceInt =  withSentence === "on" ? 1:0
        console.log(withSentenceInt)
        const deck_id = Number(formData.get("deck_id") || selectedDeckValue)
        postAPI(`/api/set_card/${withSentenceInt}`, {"front": front , "back": back ,"description": description ,"deck_id": deck_id })
    }


    return (
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {htmlDecks}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Front</label>
                        <input name="front" className="mt-1 w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400" type="text" id="front" placeholder="e.g. hello"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Back</label>
                        <input name="back" className="mt-1 w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400" type="text" id="back" placeholder ="e.g. hola" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Description</label>
                        <input name="description" className="mt-1 w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400" type="text" id="description" placeholder ="e.g. hola is a colloquial way of saying hello" />
                    </div>
                    <div>
                        <input type="checkbox" id="withSentence" name="withSentence" />
                        <label > Add a corresponding sentence </label>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400">Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    )
}