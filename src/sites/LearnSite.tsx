import {getAPI,postAPI} from "../api.ts"
import {useState,useEffect, useRef, useMemo} from "react"
import CardComponent from "../components/CardComponent"
type CardProps ={
    front:string
    back:string
    description:string
    id:number
    difficulty:number
    selected:boolean
    frontSentence : string
    backSentence:string
}
type DeckProps = {
    id:number
    name:string
}

type difficultProp= "Again"| "Hard"| "Good"| "Easy"

export default function LearnSite(){
    
    const [cards,setCards] =useState<CardProps[]>()
    const [currentCard, setCurrentCard]= useState<CardProps>()
    const [loading, setLoading] =useState<boolean>(true)
    const refCurrentCardNumber = useRef(0)
    const [updated, setUpdated] = useState(false) // only changing for rerender of fetchingCards
    const [updateWithoutDeck,setUpdateWithoutDeck ] =useState(false)
    const valChange: Map<string,number> = useMemo(()=> {const map = new Map([["EASY",0.5], ["MEDIOCRE",-0.2],["DIFFICULT",-0.7]]);return (map)}, [])
        // das war nur ne useMemo uebung -> macht hier keinen sinn
    const [selectedDeckId,setSelectedDeckId] = useState<number>() 
    const [decks,setDecks] = useState<DeckProps[]>()
    

    useEffect( ()=> {const fetchDecks = async ()=>{
        const data = await getAPI("/api/decks")
        const dataM = data.message
        setDecks(dataM)

    } ;fetchDecks()}, [])

 
    useEffect( ()=> {const fetchCard = async ()=>{
        let data;
        if (selectedDeckId){
             data = await getAPI(`/api/cards/${selectedDeckId}`)}
        else{ data = await getAPI("/api/cards")}

        const dataM = await data.message;
        const dataF:CardProps[] = dataM.map((d:Omit<CardProps,"selected">) => ({...d, selected:false}));
        console.log(dataF)
        setCards(dataF)
        // Preserve current selection on re-fetch; only default to first when none exists
        setCurrentCard(prev => {
            if (!prev) { return dataF[0] }
            const match = dataF.find(c => c.id === prev.id)
            if (match) { return match }
            const idx = refCurrentCardNumber.current
            return dataF[idx] ?? dataF[0]
        })
        setLoading(false)
    } 
    fetchCard()} , [selectedDeckId, updated])

    
    function calcDifficulty(difficult:difficultProp){

        //this function can later be used for more sophisticated algorithm depending on first entry DB or repetitions of vocab
        const valCur = valChange.get(difficult)
        let newDifficulty:number = currentCard?.difficulty +valCur
        if (newDifficulty<0){newDifficulty=0}
        else if (newDifficulty>10){newDifficulty=10}
        return newDifficulty
    }
    
    // rewrite of handleRef in order to do 
    function handleRef(difficult: difficultProp): void { 
        // Safety guard to avoid undefined access
        if (!cards || cards.length === 0 || !currentCard) { return }

        const updateCard = async ()=>{
            // Use review endpoint to update FSRS state and next_review in backend
            const dataU = await postAPI(`/api/cards/${currentCard.id}/review`, { rating: difficult })
            setUpdated(prevUp => !prevUp)
            console.log(dataU)
        }   
        updateCard();

            // For Again/Hard, immediately show the same card again
            if (difficult === "Again" || difficult === "Hard") {
                // Keep index and set current card to the same entry
                setCurrentCard(prev => prev)
            } else {
                // Select a different random card index for Good/Easy
                if (cards.length > 1){
                    let newIndex: number
                    do {
                        newIndex = Math.floor(Math.random() * cards.length)
                    } while (newIndex === refCurrentCardNumber.current)
                    refCurrentCardNumber.current = newIndex
                } else {
                    refCurrentCardNumber.current = 0
                }
                setCurrentCard(cards[refCurrentCardNumber.current])
    }
}
    /*
    function handleRef(difficult: difficultProp): void {
        if (!cards || cards.length === 0 || !currentCard) { return }
        else{
            
            const newDifficulty = calcDifficulty(difficult)
            if (newDifficulty <3){
                setCards(prevCards => prevCards?.map(
                card => card.id ===currentCard.id ?
                {...card, "difficulty": newDifficulty} :card
            ))
            }
            else{ //writing back to the db and exclude the card from the learning process
                
                const apiCall = async ()=>{
                    const data = await postAPI(`/api/set_card/${currentCard.id}/${newDifficulty}`)
                    try{
                        setUpdateWithoutDeck(true)
                        console.log(`${data.message}`)
                    }catch{console.log("error")}
                }
                apiCall()

                
            }

             

            if (updateWithoutDeck)
            {setCards(prevCards => prevCards.filter(card => card.id !==currentCard.id)); setUpdateWithoutDeck(false)}

            if (cards.length !== 1){
            const oldIndex = refCurrentCardNumber.current
            while (oldIndex ===refCurrentCardNumber.current)
                { const newIndex = Math.floor(Math.random()* cards.length)
                    refCurrentCardNumber.current = newIndex
                }     
            }

            
            setCurrentCard(cards[refCurrentCardNumber.current])
    }
}*/
/*
    const cardInstances = cards?.map(card => (
        <CardComponent
            key={card.id}
            front={card.front}
            frontSentence = {card.front_sentence}
            backSentence = {card.back_sentence}
            back={card.back}
            description={card.description}
            handleRef={handleRef}
        />
    ))
        */

    
    const cardInstance = !loading && currentCard ? (
        <CardComponent
            key={currentCard.id}
            front={currentCard.front}
            back={currentCard.back}
            frontSentence = {currentCard.frontSentence}
            backSentence = {currentCard.backSentence}
            description={currentCard.description}
            difficulty= {currentCard.difficulty}
            handleRef={handleRef}
        />
    ) : null

    const getDeckId =(event)=> {
        const value = Number(event.target.value)
        console.log(value)
        setSelectedDeckId(value)
    }

    return(
        <div>
        <select className="mt-12 mb-0" onChange={getDeckId}>
            {decks ?decks.map(deck => <option value={deck.id} key={deck.id}>{deck.name}</option>):<option >There are no decks loaded</option>}
        </select>
        <div className="min-h-screen flex flex-col mt-0">

            <main className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex items-center justify-center py-10">
                {cardInstance}
            </main>
        </div>
        </div>
    )
}