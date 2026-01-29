//import "../css/Deckcomponent.css"
import DeckActions from "./DeckActionsGPT";

type DeckComponentProps = {
    name: string;
    id: number;
    selected: boolean;
    selectDeck: (id: number) => void;
};

export default function DeckComponent({ name, id, selected, selectDeck }: DeckComponentProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {selected ? (
                <div className="flex w-full items-center justify-between gap-3 rounded border border-green-700 bg-green-50 p-3">
                    <div className="flex items-center gap-3">
                        <form>
                            <label htmlFor={`deck-action-${id}`} className="sr-only">
                                Deck options
                            </label>
                            <select
                                id={`deck-action-${id}`}
                                className="rounded border border-gray-300 bg-white px-2 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                defaultValue="default"
                            >
                                <option value="default" disabled>
                                    Choose option
                                </option>
                                <option value="practice">Practice</option>
                                <option value="review">Review</option>
                            </select>
                        </form>
                        <button
                            className="rounded bg-green-700 px-3 py-3 text-xs font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                            onClick={() => selectDeck(id)}
                        >
                            Open {name}
                        </button>
                    </div>
                    <DeckActions
                        onAddCard={() => console.log("Add Card to", id)}
                        onRename={() => console.log("Rename Deck", id)}
                        onEdit={() => console.log("Edit Deck", id)}
                        onDelete={() => console.log("Delete Deck", id)}
                    />
                </div>
            ) : (
                <button
                    className="rounded bg-yellow-700 px-3 py-3 text-xs font-medium text-white hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700"
                    onClick={() => selectDeck(id)}
                >
                    {name}
                </button>
            )}
        </div>
    );
}