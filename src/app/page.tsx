"use client";

import { useState } from "react";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { QuickActions } from "@/components/QuickActions";
import { YouTubePreview } from "@/components/YouTubePreview";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ExtractedSpot {
  name: string;
  city?: string;
  neighborhood: string;
  category: string;
  hours: string;
  rating: number;
  whatToTry: string;
  station: string;
  walkTime: number;
  isDuplicate?: boolean;
}

interface YouTubeResult {
  spots: ExtractedSpot[];
  videoTitle: string;
  summary: string;
}

const INITIAL_SUGGESTIONS = [
  "Plan my day in Shibuya",
  "Coffee spots nearby",
  "What's in Ginza?",
  "Show me all eyewear shops",
];

const YOUTUBE_REGEX = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/;

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeResult, setYoutubeResult] = useState<YouTubeResult | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Check for YouTube URL
    const ytMatch = text.match(YOUTUBE_REGEX);
    if (ytMatch) {
      try {
        const res = await fetch("/api/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: ytMatch[0] }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.spots?.length > 0) {
          setYoutubeResult(data);
          setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: `🎬 Found ${data.spots.length} spots in "${data.videoTitle}". Review and select which ones to add:` }]);
        } else {
          setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: "I watched the video but couldn't find any specific locations mentioned. Try a different video?" }]);
        }
      } catch {
        setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I couldn't process that video. It may be private or unavailable." }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Normal chat flow
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: data.content }]);
    } catch {
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (spots: ExtractedSpot[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/youtube/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spots }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const added = data.results.filter((r: { success: boolean }) => r.success).length;
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: `✅ Added ${added} spot${added !== 1 ? "s" : ""} to your master list!` }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Failed to add spots. Please try again." }]);
    } finally {
      setYoutubeResult(null);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <main className="flex flex-col h-[100dvh] max-w-4xl mx-auto" data-testid="chat-page">
      <header className="shrink-0 p-4 border-b bg-white">
        <h1 className="text-xl font-bold">🗼 Conan — Tokyo Travel Guide</h1>
        <p className="text-sm text-gray-500">Ask me about spots, plan your day, or manage your list</p>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessages messages={messages} isLoading={isLoading} />

        {youtubeResult && (
          <div className="shrink-0 px-4 pb-2">
            <YouTubePreview
              spots={youtubeResult.spots}
              videoTitle={youtubeResult.videoTitle}
              summary={youtubeResult.summary}
              onApprove={handleApprove}
              onCancel={() => setYoutubeResult(null)}
            />
          </div>
        )}

        {messages.length === 0 && !youtubeResult && (
          <div className="shrink-0 px-4 pb-2">
            <QuickActions suggestions={INITIAL_SUGGESTIONS} onSelect={sendMessage} />
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  );
}
