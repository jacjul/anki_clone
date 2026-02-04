
import type {JSX} from "react"

type typ1="DELETE" |"ADD" | "LEARN"

type ButtonDeckActionsProps ={
    typButton: "DELETE" | "LEARN" | "ADD"
    id:number
    onAction: (typButton:typ1, id:number) => void 
}

export default function ButtonDeckActions({typButton,id, onAction}:ButtonDeckActionsProps):JSX.Element{
    const base = "px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2"
    const variants: Record<typeof typButton, string> = {
        DELETE: `${base} border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-300`,
        LEARN: `${base} border border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:ring-zinc-300`,
        ADD: `${base} border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-300`,
    }

    return (
        <div className="flex justify-start">
            <button onClick={() => onAction(typButton, id)} className={`${variants[typButton]} m-1`}>
                {typButton}
            </button>
        </div>
    )
}