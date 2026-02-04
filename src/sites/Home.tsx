export default function Home(){
    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900">Welcome to Anki Clone</h1>
                    <p className="mt-3 text-zinc-600">Practice your cards, manage decks, and add new vocabulary — all in a clean, focused interface.</p>
                </div>
            </div>
        </div>
    )
}