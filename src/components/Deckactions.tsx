
import type {JSX} from "react"
import {postAPI} from "../api.ts"

type typ1="DELETE" |"ADD" | "LEARN"

type ButtonDeckActionsProps ={
    typButton: "DELETE" | "LEARN" | "ADD"
    id:number
    onAction: (typButton:typ1, id:number) => void 
}

export default function ButtonDeckActions({typButton,id, onAction}:ButtonDeckActionsProps):JSX.Element{
    

    
    return (<div>
    {typButton === "DELETE" && <button  onClick={()=>onAction(typButton,id)} className="text-left ">
        {typButton}
    </button>}
    {typButton === "LEARN" && <button  onClick={()=>onAction(typButton,id)} className="text-left ">
        {typButton}
    </button>}
        {typButton === "ADD" && <button  onClick={()=>onAction(typButton,id)} className="text-left ">
        {typButton}
    </button>}
    </div>


)
}