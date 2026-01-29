
import {postAPI, getAPI} from "../api"
import {useEffect,useState} from "react"
import type {JSX} from "react"
type DeckProps = {
    id:number
    name:string
    selected: boolean
}

export default function AddCardSite({id}:{id?:number}){
        const [receivingDeck,setReceivingDeck]=useState<DeckProps[]>()
        let htmlDecks:unknown|JSX.Element =undefined
        if (!id){
        useEffect(() => {
            getAPI("/api/decks").then(data => {
                if (data) {setReceivingDeck(data.message.map((deck:DeckProps):DeckProps =>
                    Object.assign(deck, {"selected":false})
                ))};
            });
        },[] )
    //create the html element to add
         
}
    function createDropdown(decks:DeckProps[]){
        return (<div>
            <label></label>
            <select name="deck_id">
                {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
            </select>
        </div>)
    }

    if(!id &&receivingDeck){
        htmlDecks =createDropdown(receivingDeck)
    }
    async function handleSubmit(formData){
        console.log(formData)
        const front:string = formData.get("front") 
        const back:string = formData.get("back")
        const description:string = formData.get("description")
        const deck_id:number = parseInt(formData.get("deck_id"))
        postAPI("/api/set_card", {"front": front , "back": back ,"description": description ,"deck_id":deck_id})
    }


    return (
        <div className="mt-30">
        
        <form action={handleSubmit} >
            {htmlDecks && htmlDecks } 
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