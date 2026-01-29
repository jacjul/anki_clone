//import "../css/Deckcomponent.css"
import  ButtonDeckActions from "./Deckactions"

type typ1="DELETE" |"ADD" | "LEARN"
type DeckComponentProps =  {
    name:string
    id:number
    selected:boolean
    selectDeck: (id:number)=>void
    big? :boolean
    onAction: (typ:typ1, id:number)=>void
}

export default function DeckComponent({name, id,selected, big, selectDeck,onAction}:DeckComponentProps){
    return (
        big? 
        <div className="flex flex-row">
            <button className="w-full flex-1 bg-green-300 rounded-md">{name} </button>
            <div className="flex flex-col ">
                < ButtonDeckActions id={id} typButton="DELETE" onAction={onAction}>Delete Deck</ ButtonDeckActions  >
                < ButtonDeckActions id={id} typButton="LEARN" onAction={onAction}>Learn Cards</ ButtonDeckActions  >
                < ButtonDeckActions id={id} typButton="ADD" onAction={onAction}>Add Cards</ ButtonDeckActions  >
            </div>
        </div> :
    <div className="flex ">
        {selected?        
        <div className="flex flex-wrap w-4/5 ">

        <button   className="rounded-md w-20 bg-green-200 h-24 text-xs p-1, gap-2" onClick ={() =>selectDeck(id)} >
            {name}
        </button>
        </div>:
                <button   className="rounded-md w-20 h-24 text-xs bg-gray-100 p-1 gap-2" onClick ={() =>selectDeck(id)} >
            {name}
        </button>}
        

    </div>)
}