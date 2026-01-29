import { getAPI, postAPI } from "../api.ts";
import { useState, useEffect } from "react";
import DeckComponent from "../components/Deckcomponent"
import { useNavigate } from "react-router-dom"

type typ1= "DELETE" | "ADD" |"LEARN"
type DeckProps = {
    id:number
    name:string
    selected: boolean
}

export default function DecksSite() {
    const navigate = useNavigate();
    const [updateDecks, setUpdateDecks] = useState<boolean>(false);
    const [deckName, setDeckName] = useState("");
    const [receivingDeck , setReceivingDeck]= useState<DeckProps[]>([])
    const [selectedDeck,setSelectedDeck] =useState<DeckProps | unknown>({})
    const [selectedDeckExisiting, setSelectedDeckExisiting] =useState<boolean>(false)

    useEffect(() => {
        getAPI("/api/decks").then(data => {
            if (data) {setReceivingDeck(data.message.map((deck:DeckProps):DeckProps =>
                Object.assign(deck, {"selected":false})
            ))};
        });
    }, [updateDecks]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await postAPI("/api/decks", { name: deckName });
            console.log(result.message);
            setDeckName(""); // Clear input after successful submit
            setUpdateDecks(prevUpdate => !prevUpdate)
        } catch (error) {
            console.error("Failed to create deck:", error);
        }
    };

    function selectDeck(id:number):void{
        setReceivingDeck(prevDecks => prevDecks.map(deck=> deck.id===id? {...deck,"selected":true}:{...deck, "selected":false}))
        setSelectedDeckExisiting(true)
        setSelectedDeck(receivingDeck.find(deck => deck.id === id))


    }


    async function onAction (typ:typ1,id:number):Promise<void>{
        if (typ ==="DELETE"){
            try{
            const result = await postAPI(`api/decks/${id}`)
            console.log(result)
            setUpdateDecks(prev => !prev)
        }
        catch (error){console.log("Deck could not be successfully deleted")}}
        else if(typ ==="ADD"){
            // Navigate to AddCardSite with deckId as a URL param for robust deep-linking
            navigate(`/addCards/${id}`)
        }
    }


    console.log(selectedDeck)
    const DeckComponentInstances = receivingDeck.map(deck => <DeckComponent key={deck.id} id={deck.id} name ={deck.name} selected={deck.selected} onAction={onAction} selectDeck={selectDeck}/>)
    const selected = selectedDeck as DeckProps;
    return (
        <div className="mt-20">
        {selectedDeckExisiting? 
        <div className="flex flex-row min-h-[calc(100vh-80px)] gap-10 ">       
            <div className="flex flex-wrap align-center justify-center w-3/5">
                <div className="grid grid-cols-7 gap-2">{DeckComponentInstances}</div>
            </div>
            <div className="w-3/5 ">
            <DeckComponent key={selected.id} id={selected.id} name ={selected.name} selected={selected.selected} big={true} onAction={onAction} selectDeck={selectDeck}/>
            </div>
        </div>
         :
        <div className="flex flex-wrap align-center justify-center">
            <div className="grid grid-cols-10 gap-2">{DeckComponentInstances}</div>
        </div>}

        <form onSubmit={handleSubmit}>
            <label>Put a Deck here</label>
            <input
                placeholder="eg spanish german"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
        </div>
    );
}