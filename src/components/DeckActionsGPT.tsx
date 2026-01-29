import { useEffect, useRef, useState } from "react";

type DeckActionsProps = {
  onAddCard?: () => void;
  onRename?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function DeckActions({ onAddCard, onRename, onEdit, onDelete }: DeckActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Actions
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Deck actions"
          className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5"
        >
          <div className="py-1">
            <button
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onAddCard?.();
                setOpen(false);
              }}
            >
              Add Card
            </button>
            <button
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onRename?.();
                setOpen(false);
              }}
            >
              Rename Deck
            </button>
            <button
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onEdit?.();
                setOpen(false);
              }}
            >
              Edit Details
            </button>
            <button
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                onDelete?.();
                setOpen(false);
              }}
            >
              Delete Deck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
