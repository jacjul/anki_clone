
import type {JSX} from "react"
import {postAPI} from "../api.ts"

type typ1="DELETE" |"ADD" | "LEARN"

type ButtonDeckActionsProps ={
    typButton: "DELETE" | "LEARN" | "ADD"
    id:number
    onAction: (typButton:typ1, id:number) => void 
}

export default function ButtonDeckActions({typButton,id, onAction}:ButtonDeckActionsProps):JSX.Element{
    

    
    return (<div className="flex justify-start">
    {typButton === "DELETE" && <button  onClick={()=>onAction(typButton,id)} className="text-left p-1 bg-grey-200 border shadow-md rounded-lg hover:bg-grey-400 m-1">
        {typButton}
    </button>}
    {typButton === "LEARN" && <button  onClick={()=>onAction(typButton,id)} className="text-left p-1 bg-grey-200 border shadow-md rounded-lg hover:bg-grey-400 m-1">
        {typButton}
    </button>}
        {typButton === "ADD" && <button  onClick={()=>onAction(typButton,id)} className="text-left p-1 bg-grey-200 border shadow-md rounded-lg hover:bg-grey-400  m-1">
        {typButton}
    </button>}
    </div>


)
}