"use client";

import { useState } from "react";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { QuickActions } from "@/components/QuickActions";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_SUGGESTIONS = [
  "Plan my day in Shibuya",
  "Coffee spots nearby",
  "What's in Ginza?",
  "Show me all eyewear shops",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: data.content };
      setMessages([...newMessages, assistantMsg]);
    } catch {
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto" data-testid="chat-page">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold">🗼 Conan — Tokyo Travel Guide</h1>
        <p className="text-sm text-gray-500">Ask me about spots, plan your day, or manage your list</p>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatMessages messages={messages} isLoading={isLoading} />

        {messages.length === 0 && (
          <div className="px-4 pb-2">
            <QuickActions suggestions={INITIAL_SUGGESTIONS} onSelect={sendMessage} />
          </div>
        )}

        <ChatInput
          input={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
