
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
        return (<div>
            <label></label>
                        <select name="deck_id" value={selectedDeckValue || ""} onChange={getDeck}>
                {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
            </select>
        </div>)
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
        const deck_id = Number(formData.get("deck_id") || selectedDeckValue)
        postAPI("/api/set_card", {"front": front , "back": back ,"description": description ,"deck_id": deck_id })
    }


    return (
        <div className="mt-30">
        
        <form onSubmit={handleSubmit} >
            {htmlDecks}
            <label>Frontside</label>
            <input name="front" className="bg-gray200  px-2 py-4 border rounded shadow-sm w-full" type="text" id="front" placeholder="e.g. hello "/> 
            <label>Backside</label>
            <input name="back" className="bg-gray200 p-2 border rounded shadow-sm w-full" type="text" id="back" placeholder ="e.g. hola" />
            <label>Description</label>
            <input name="description" className="bg-gray200 p-2 border rounded shadow-sm w-full" type="text" id="description" placeholder ="e.g. hola is a colloquial way of saying hello" />
            <button type="submit" ></button>
        </form>
        </div>
    )
}