"use client";

interface QuickActionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function QuickActions({ suggestions, onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2" data-testid="quick-actions">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
          data-testid="quick-action-button"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
