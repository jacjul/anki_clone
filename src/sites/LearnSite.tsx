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
}

type difficultProp= "EASY"|"MEDIOCRE"|"DIFFICULT"

export default function LearnSite(){
    
    const [cards,setCards] =useState<CardProps[]>()
    const [currentCard, setCurrentCard]= useState<CardProps>()
    const [loading, setLoading] =useState<boolean>(true)
    const refCurrentCardNumber = useRef(0)
    const [updateWithoutDeck,setUpdateWithoutDeck ] =useState(false)
    const valChange: Map<string,number> = useMemo(()=> {const map = new Map([["EASY",0.5], ["MEDIOCRE",-0.2],["DIFFICULT",-0.7]]);return (map)}, [])
        // das war nur ne useMemo uebung -> macht hier keinen sinn

    /*let lCards:[] = []
    useEffect( ()=>{getAPI("/api/cards").then(data => data.message.map((d:Omit<CardProps,"selected">):void => 
        { lCards.push(Object.assign(d ,{selected:false}))
    }))
    setCards(lCards)}, []);*/
  
    useEffect( ()=> {const fetchData = async ()=>{
        const data = await getAPI("/api/cards");
        const dataM = await data.message;
        const dataF:CardProps[] = dataM.map((d:Omit<CardProps,"selected">) => ({...d, selected:false}));
        setCards(dataF)
        setCurrentCard(dataF[0])
        setLoading(false)
    } 
    fetchData()} , [])

    function calcDifficulty(difficult:difficultProp){

        //this function can later be used for more sophisticated algorithm depending on first entry DB or repetitions of vocab
        const valCur = valChange.get(difficult)
        let newDifficulty:number = currentCard?.difficulty +valCur
        if (newDifficulty<0){newDifficulty=0}
        else if (newDifficulty>10){newDifficulty=10}
        return newDifficulty
    }
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
}

    const cardInstances = cards?.map(card => (
        <CardComponent
            key={card.id}
            front={card.front}
            back={card.back}
            description={card.description}
            handleRef={handleRef}
        />
    ))
    // Single current card instance (rendered after useEffect sets state)
    const cardInstance = !loading && currentCard ? (
        <CardComponent
            key={currentCard.id}
            front={currentCard.front}
            back={currentCard.back}
            description={currentCard.description}
            difficulty= {currentCard.difficulty}
            handleRef={handleRef}
        />
    ) : null



    return(
        <div className="min-h-screen flex flex-col">
            <main className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex items-center justify-center py-10">
                {cardInstance}
            </main>
        </div>
    )
}