import { useState } from "react";

interface MultilineDropdownProps {
  label: string;
  text: string;
  className?: string;
}

export function MultilineDropdown({ label, text, className }: MultilineDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((open) => !open);
  }

  return (
    <div className={`w-full mb-4 ${className || ''}`}>
      <button
        className="flex items-center w-full justify-between px-4 py-2 text-left font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent hover:border-blue-400 transition"
        aria-expanded={isOpen}
        aria-controls="lesson-description-content"
        onClick={handleToggle}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); }}
        aria-label={isOpen ? `Hide ${label}` : `Show ${label}`}
        type="button"
      >
        <span>{label}</span>
        <svg className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.845a.75.75 0 01-1.02 0l-4.25-3.845a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div
          id="lesson-description-content"
          className="mt-2 px-4 py-2 rounded shadow text-base whitespace-pre-line"
        >
          {text.split(/\r?\n/).map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < text.split(/\r?\n/).length - 1 && <br />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultilineDropdown;
