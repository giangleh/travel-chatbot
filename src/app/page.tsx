"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { QuickActions } from "@/components/QuickActions";
import dynamic from "next/dynamic";
import type { Spot } from "@/types";

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />,
});

const INITIAL_SUGGESTIONS = [
  "Plan my day in Shibuya",
  "Coffee spots nearby",
  "What's in Ginza?",
  "Show me all eyewear shops",
];

export default function ChatPage() {
  const [mapSpots, setMapSpots] = useState<Spot[]>([]);
  const [showMap, setShowMap] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      try {
        const parsed = JSON.parse(message.content);
        if (parsed.locations?.length > 0) {
          setMapSpots(parsed.locations);
          setShowMap(true);
        }
      } catch {
        // Non-JSON response, no map update needed
      }
    },
  });

  const sendQuickAction = (text: string) => {
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
    setTimeout(() => {
      const form = document.querySelector("form");
      form?.requestSubmit();
    }, 0);
  };

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto" data-testid="chat-page">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold">🗼 Conan — Tokyo Travel Guide</h1>
        <p className="text-sm text-gray-500">Ask me about spots, plan your day, or manage your list</p>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMessages messages={messages} />

          {messages.length === 0 && (
            <div className="px-4 pb-2">
              <QuickActions suggestions={INITIAL_SUGGESTIONS} onSelect={sendQuickAction} />
            </div>
          )}

          <ChatInput
            input={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {showMap && (
          <div className="h-64 md:h-auto md:w-80 border-t md:border-t-0 md:border-l">
            <MapView spots={mapSpots} />
          </div>
        )}
      </div>
    </main>
  );
}
