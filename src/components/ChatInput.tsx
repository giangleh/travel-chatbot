"use client";

import type { ChangeEvent, FormEvent } from "react";

interface ChatInputProps {
  input: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, onChange, onSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="shrink-0 p-4 border-t bg-white" data-testid="chat-input-form">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={onChange}
          placeholder="Ask about Tokyo spots..."
          disabled={isLoading}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          data-testid="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="chat-send-button"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </form>
  );
}
