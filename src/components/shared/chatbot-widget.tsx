"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useAuthStore } from "@/stores";
import { answer, type ChatResponse } from "@/lib/ai/chatbot";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  author: "you" | "voyager";
  text: string;
  suggestions?: string[];
}

const INITIAL: ChatMessage = {
  id: "intro",
  author: "voyager",
  text: "Hi! I'm Voyager. Ask me about destinations, budgets, weather, or what to pack.",
  suggestions: ["Best time for Santorini", "Maldives budget", "What to pack for Iceland"],
};

export function ChatbotWidget() {
  const status = useAuthStore((s) => s.status);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (status !== "authenticated") return null;

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    const id = `m-${Date.now()}`;
    setMessages((prev) => [...prev, { id, author: "you", text: value }]);
    setDraft("");
    setTyping(true);
    window.setTimeout(() => {
      const response: ChatResponse = answer(value);
      setMessages((prev) => [
        ...prev,
        {
          id: `${id}-reply`,
          author: "voyager",
          text: response.text,
          suggestions: response.suggestions,
        },
      ]);
      setTyping(false);
    }, 450);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open travel assistant"
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-violet-500 text-white shadow-xl transition-transform hover:scale-105",
          open && "scale-90",
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Travel assistant"
          className="fixed bottom-20 right-5 z-40 flex h-[60vh] max-h-[560px] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        >
          <header className="flex items-center gap-3 border-b border-border bg-linear-to-r from-sky-500 to-violet-500 px-4 py-3 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Voyager AI</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Travel assistant
              </p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-3">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-2",
                    message.author === "you" ? "items-end" : "items-start",
                  )}
                >
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      message.author === "you"
                        ? "bg-navy-950 text-white"
                        : "bg-surface-muted text-text-primary",
                    )}
                  >
                    {message.text}
                  </p>
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] font-medium text-text-secondary hover:border-border-strong"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              {typing && (
                <li className="flex items-start">
                  <p className="rounded-2xl bg-surface-muted px-3 py-2 text-sm text-text-secondary">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" />
                    </span>
                  </p>
                </li>
              )}
            </ul>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 border-t border-border px-3 py-3"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything…"
              maxLength={200}
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-sky-600"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!draft.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950 text-white hover:bg-navy-800 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
