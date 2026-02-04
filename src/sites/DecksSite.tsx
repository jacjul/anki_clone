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
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            {selectedDeckExisiting ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-160px)]">
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {DeckComponentInstances}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <DeckComponent key={selected.id} id={selected.id} name={selected.name} selected={selected.selected} big={true} onAction={onAction} selectDeck={selectDeck} />
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {DeckComponentInstances}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm p-4 flex items-end gap-3">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700">Create a new deck</label>
                    <input
                        placeholder="e.g. Spanish A1"
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                        className="mt-1 w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    />
                </div>
                <button type="submit" className="px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400">Submit</button>
            </form>
        </div>
    );
}