"use client";

import type { Message } from "ai";
import { useEffect, useRef } from "react";

export function ChatMessages({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
            data-testid={`message-${m.role}`}
          >
            <p className="whitespace-pre-wrap text-sm">{m.content}</p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
