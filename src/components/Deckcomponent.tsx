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
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4 flex items-start gap-4">
            <div className="flex-1">
                <div className="text-lg font-semibold text-zinc-900">{name}</div>
                <div className="text-sm text-zinc-500">Deck ID: {id}</div>
            </div>
            <div className="flex flex-col items-end">
                <ButtonDeckActions id={id} typButton="DELETE" onAction={onAction} />
                <ButtonDeckActions id={id} typButton="LEARN" onAction={onAction} />
                <ButtonDeckActions id={id} typButton="ADD" onAction={onAction} />
            </div>
        </div> :
    <div className="flex">
        <button
            className={`rounded-lg w-24 h-24 text-xs px-2 py-1 border shadow-sm transition ${selected ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}
            onClick={() => selectDeck(id)}
        >
            {name}
        </button>
    </div>)
}