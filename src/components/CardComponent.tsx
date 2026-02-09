import {useState} from "react"

type difficultProp= "Again"| "Hard"| "Good"| "Easy"

type CardProps ={
    front: string
    frontSentence:string
    back: string
    backSentence:string
    description: string
    difficulty: number
    handleRef?: (difficult:difficultProp) => void
}

export default function CardComponent({front,frontSentence, back,backSentence, description, handleRef,difficulty}: CardProps){
    const [resolve, setResolve] = useState<boolean>(false)
    const [clickedOnce, setClickedOnce]= useState<boolean>(false)
    function handleClick(difficult?:difficultProp){
        if (clickedOnce){
            setResolve(false)
            handleRef?.(difficult)
            setClickedOnce(false)
        }else{
            setResolve(true)
            setClickedOnce(true)
        }  
    }

    return(
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm w-full sm:w-[560px]">
            <div className="grid grid-rows-[auto_1fr_auto] gap-6 p-6">
                <div className="text-xl font-medium text-zinc-900">
                    {front}
                    
                </div>
                <div className="text-m font-thin text-zinc-500">
                    {frontSentence}
                    
                </div>

                <div className="min-h-24 sm:min-h-32 transition-opacity duration-200 text-zinc-700">
                    {resolve && (
                        <>
                            <div className="mb-2 text-xl font-medium text-zinc-800">{back}</div>
                            <div className="text-m font-thin text-zinc-500">{backSentence}</div>

                            <div className="text-sm font-thin text-zinc-300">{description}</div>
                        </>
                    )}
                </div>

                <div className="justify-self-center">
                    {!clickedOnce && (
                        <button
                            className="px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 transition"
                            onClick={handleClick}
                        >
                            Show answer
                        </button>
                    )}
                    {clickedOnce && (
                        <div className="flex items-center justify-center gap-3">
                            <button
                                className="px-3 py-2 rounded-md border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                                onClick={() => handleClick("Again")}
                            >
                                Again
                            </button>
                            <button
                                className="px-3 py-2 rounded-md border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                onClick={() => handleClick("Hard")}
                            >
                                Hard
                            </button>
                            <button
                                className="px-3 py-2 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                onClick={() => handleClick("Good")}
                            >
                                Good
                            </button>
                            <button
                                className="px-3 py-2 rounded-md border border-emerald-300 bg-emerald-200 text-emerald-500 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                onClick={() => handleClick("Easy")}
                            >
                                Easy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}